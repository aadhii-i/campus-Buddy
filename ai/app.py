"""
Campus Buddy AI Service.

FastAPI entrypoint. Express calls this service; this service never talks to
MongoDB or holds business logic — it only turns documents into a searchable
index and answers questions against that index.
"""
import logging
import os
import uuid

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import config
from services.analyzer import get_resume_analyzer
from services.parser import extract_text_from_pdf
from services.roles import is_valid_role, list_roles

# NOTE: services.rag (and its sentence-transformers/torch dependency) is
# imported lazily inside the /upload and /chat handlers only — see
# services/embeddings.py. /health and /analyze must stay lightweight.

logging.basicConfig(level=logging.INFO, format="%(asctime)s [ai] %(levelname)s %(message)s")
log = logging.getLogger("campus-buddy-ai")

app = FastAPI(title="Campus Buddy AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    session_id: str
    question: str


class AnalyzeRequest(BaseModel):
    session_id: str
    target_role: str


def _resume_namespace(session_id: str) -> str:
    """Isolates each user's resume in its own FAISS index."""
    return f"resume_{session_id}"


@app.on_event("startup")
def _log_startup() -> None:
    log.info(
        "startup: model=%s gemini_key=%s allowed_origins=%s upload_dir=%s",
        config.GEMINI_MODEL,
        "set" if config.GEMINI_API_KEY else "MISSING",
        config.ALLOWED_ORIGINS,
        config.UPLOAD_DIR,
    )
    if not config.GEMINI_API_KEY:
        log.warning("GEMINI_API_KEY is not set — /analyze and /chat will fail until it is configured.")


@app.get("/health")
def health():
    # `status: ok` is what the Express passthrough and Render health check look
    # for. The extra fields make it obvious from one curl whether the problem is
    # a missing API key vs. an unreachable service.
    return {
        "status": "ok",
        "service": "campus-buddy-ai",
        "geminiConfigured": bool(config.GEMINI_API_KEY),
        "model": config.GEMINI_MODEL,
    }


@app.get("/gemini/health")
def gemini_health():
    """Prove the AI service can actually reach the configured Gemini model with
    a minimal generate-content call BEFORE anyone tries a real resume analysis
    (req #5). Lightweight — no PDF, no torch. Returns the real upstream error
    verbatim on failure so Render logs pinpoint key vs. model vs. quota.

    Goes through the same retry+fallback path as /analyze (services.gemini_retry)
    so a transient 429/503 reports the same outcome a real analysis would get,
    instead of flagging "unhealthy" for a blip /analyze would have survived.
    Not Render's healthCheckPath (that's the cheap /health above), so this
    doesn't affect service uptime — it's a manual deep-check endpoint.
    """
    import time

    from services.gemini_retry import generate_content_with_retry

    if not config.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the AI service.")

    from google import genai
    from google.genai import types

    started = time.monotonic()
    try:
        client = genai.Client(
            api_key=config.GEMINI_API_KEY,
            http_options=types.HttpOptions(timeout=config.GEMINI_TIMEOUT_MS),
        )
        resp = generate_content_with_retry(
            client,
            model=config.GEMINI_MODEL,
            contents="ping",
            fallback_model=config.GEMINI_FALLBACK_MODEL,
            log_context="health",
        )
        latency_ms = round((time.monotonic() - started) * 1000)
        log.info("[AI] gemini/health ok model=%s latency=%dms", config.GEMINI_MODEL, latency_ms)
        return {
            "status": "ok",
            "model": config.GEMINI_MODEL,
            "latencyMs": latency_ms,
            "sample": (resp.text or "")[:60],
        }
    except Exception as exc:  # noqa: BLE001 — surface the real cause
        latency_ms = round((time.monotonic() - started) * 1000)
        log.error(
            "[AI] gemini/health FAILED model=%s latency=%dms %s: %s",
            config.GEMINI_MODEL, latency_ms, type(exc).__name__, exc,
        )
        raise HTTPException(
            status_code=502,
            detail=f"Gemini check failed ({type(exc).__name__}): {exc}",
        ) from exc


@app.get("/roles")
def get_roles():
    return {"roles": list_roles()}


def _index_resume(session_id: str, file_path: str) -> int:
    """Build the FAISS index for the resume chat. Returns chunk count."""
    from services.rag import get_rag_engine  # lazy: pulls torch, see module note

    # Cached: if the user opens chat right after this, /chat reuses this same
    # engine (already holding the index in memory) instead of reloading it.
    engine = get_rag_engine(_resume_namespace(session_id))
    return engine.ingest_document(file_path)


def _truthy(value: str) -> bool:
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


@app.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    session_id: str = Form(None),
    # The Resume Analyzer only needs the PDF saved so /analyze can re-parse it.
    # Building the FAISS chat index eagerly loads sentence-transformers/torch
    # (~500MB+ RSS) which OOM-kills a 512MB instance mid-request — an
    # uncatchable SIGKILL, so it can't be "handled" here, it just takes the
    # whole flow (analyze included) down with a platform 502. So the analyzer
    # passes index=false: save + text-check only (cheap), and /chat builds the
    # index on demand later if the user actually opens the chat.
    index: str = Form("true"),
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    session_id = session_id or str(uuid.uuid4())
    file_path = os.path.join(config.UPLOAD_DIR, f"{session_id}.pdf")

    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
    log.info("[RESUME] upload received: session=%s bytes=%d", session_id, len(contents))

    # Confirm the PDF has extractable text now, so /analyze (which only needs
    # this file + Gemini) never fails later for a scanned/image-only resume.
    extracted = extract_text_from_pdf(file_path)
    if not extracted.strip():
        os.remove(file_path)
        raise HTTPException(
            status_code=400,
            detail="No readable text found in this PDF. Export it as a text-based PDF (not a scan or image) and try again.",
        )
    log.info("[RESUME] PDF extracted: session=%s chars=%d", session_id, len(extracted))

    want_index = _truthy(index)
    if not want_index:
        log.info("[RESUME] indexing skipped (index=false): session=%s — /analyze ready, chat will index on demand", session_id)
        return {
            "success": True,
            "sessionId": session_id,
            "chunksIndexed": 0,
            "chatReady": False,
        }

    # index=true: caller explicitly wants the chat index built now. Still
    # non-fatal on a soft error — /analyze never needs it — but note an OOM
    # here is a hard process kill this except cannot catch.
    log.info("[RESUME] indexing started: session=%s", session_id)
    chunk_count = 0
    chat_ready = False
    try:
        chunk_count = _index_resume(session_id, file_path)
        chat_ready = True
        log.info("[RESUME] indexing done: session=%s chunks=%d", session_id, chunk_count)
    except ValueError as exc:
        # PDF genuinely has no indexable content — real client error.
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception:  # noqa: BLE001
        log.exception("[RESUME] indexing failed: session=%s (chat degraded, analyze unaffected)", session_id)

    return {
        "success": True,
        "sessionId": session_id,
        "chunksIndexed": chunk_count,
        "chatReady": chat_ready,
    }


# Sync `def` on purpose: the Gemini call blocks for several seconds. FastAPI
# runs sync handlers in a worker thread, so the event loop (and /health) stays
# responsive during an analysis instead of freezing.
@app.post("/analyze")
def analyze_resume(payload: AnalyzeRequest):
    if not is_valid_role(payload.target_role):
        raise HTTPException(
            status_code=400,
            detail=f"Unknown target role: {payload.target_role}. Valid roles: {', '.join(list_roles())}",
        )

    file_path = os.path.join(config.UPLOAD_DIR, f"{payload.session_id}.pdf")
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="No resume found for this session. Please upload a resume first.",
        )

    # Re-parse the saved PDF fresh rather than reassembling FAISS chunks —
    # those overlap by design for retrieval and would double-count text here.
    resume_text = extract_text_from_pdf(file_path)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="No extractable text found in this resume.")

    log.info(
        "[AI] analyze request received: session=%s role=%s resume_chars=%d model=%s",
        payload.session_id,
        payload.target_role,
        len(resume_text),
        config.GEMINI_MODEL,
    )

    try:
        analyzer = get_resume_analyzer()
        log.info("[AI] Gemini request started: session=%s model=%s", payload.session_id, config.GEMINI_MODEL)
        result = analyzer.analyze(resume_text, payload.target_role)
        log.info("[AI] Gemini response received: session=%s", payload.session_id)
    except RuntimeError as exc:
        # Missing GEMINI_API_KEY, or the Gemini API call itself failed (bad
        # model, invalid key, quota, upstream error). The analyzer already
        # logged the specific cause with the model name.
        log.error("[AI] analyze gemini/config error: session=%s %s", payload.session_id, exc)
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except ValueError as exc:
        # Model returned something unparseable / empty.
        log.error("[AI] analyze bad LLM response: session=%s %s", payload.session_id, exc)
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001 — clean 502, but keep the real cause visible (req #15)
        log.exception("[AI] analyze unexpected failure: session=%s", payload.session_id)
        raise HTTPException(
            status_code=502,
            detail=f"Unexpected error during analysis ({type(exc).__name__}): {exc}",
        ) from exc

    log.info(
        "[AI] returning analysis: session=%s overall=%s ats=%s",
        payload.session_id,
        result.get("overallScore"),
        result.get("atsScore"),
    )
    return {"success": True, "analysis": result}


@app.post("/chat")
def chat(payload: ChatRequest):  # sync: embedding + Gemini calls block, see /analyze note
    from services.rag import get_rag_engine  # lazy: pulls torch, see module note

    # Cached per session (namespace): reuses the already-loaded FAISS index
    # and Gemini client across every message in this conversation instead of
    # reloading the index off disk and rebuilding the client on each one.
    try:
        engine = get_rag_engine(_resume_namespace(payload.session_id))
    except Exception as exc:  # noqa: BLE001 — vector store load / FAISS read failure
        log.exception("[CHAT] vector store init failed: session=%s", payload.session_id)
        raise HTTPException(
            status_code=503,
            detail="The resume chat assistant is temporarily unavailable. Your analysis above is unaffected.",
        ) from exc

    # If /upload couldn't build the index earlier (small instance, transient
    # error), build it now from the saved PDF instead of dead-ending the chat.
    if not engine.store.exists():
        pdf_path = os.path.join(config.UPLOAD_DIR, f"{payload.session_id}.pdf")
        if not os.path.exists(pdf_path):
            raise HTTPException(
                status_code=404,
                detail="No resume found for this session. Please upload a resume first.",
            )
        try:
            log.info("[CHAT] session=%s index missing, building on demand", payload.session_id)
            engine.ingest_document(pdf_path)
        except ValueError as exc:
            # PDF genuinely has no indexable content — real client error.
            log.error("[CHAT] indexing: no extractable content: session=%s %s", payload.session_id, exc)
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except Exception as exc:  # noqa: BLE001 — embedding model / vector store failure
            log.exception("[CHAT] on-demand indexing failed (embedding/vector-store): session=%s", payload.session_id)
            raise HTTPException(
                status_code=503,
                detail="The resume chat assistant is temporarily unavailable. Your analysis above is unaffected.",
            ) from exc

    try:
        answer = engine.answer(payload.question, top_k=config.TOP_K)
    except RuntimeError as exc:
        # Gemini call exhausted retries + fallback. The real status
        # (429/503/auth/model) was already logged in services/gemini_retry.py
        # and services/llm.py with the model name attached.
        log.error("[CHAT] Gemini call failed: session=%s %s", payload.session_id, exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001 — retrieval / vector-store / parsing failure
        log.exception("[CHAT] unexpected failure (retrieval/vector-store): session=%s", payload.session_id)
        raise HTTPException(status_code=502, detail="The AI assistant failed to answer. Please try again.") from exc

    return {"success": True, "answer": answer}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=config.PORT, reload=True)
