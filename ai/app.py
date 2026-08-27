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
from services.analyzer import ResumeAnalyzer
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


@app.get("/roles")
def get_roles():
    return {"roles": list_roles()}


def _index_resume(session_id: str, file_path: str) -> int:
    """Build the FAISS index for the resume chat. Returns chunk count."""
    from services.rag import RAGEngine  # lazy: pulls torch, see module note

    engine = RAGEngine(namespace=_resume_namespace(session_id))
    return engine.ingest_document(file_path)


@app.post("/upload")
async def upload_resume(file: UploadFile = File(...), session_id: str = Form(None)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    session_id = session_id or str(uuid.uuid4())
    file_path = os.path.join(config.UPLOAD_DIR, f"{session_id}.pdf")

    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Confirm the PDF has extractable text now, so /analyze (which only needs
    # this file + Gemini) never fails later for a scanned/image-only resume.
    if not extract_text_from_pdf(file_path).strip():
        os.remove(file_path)
        raise HTTPException(
            status_code=400,
            detail="No readable text found in this PDF. Export it as a text-based PDF (not a scan or image) and try again.",
        )

    log.info("upload: session=%s bytes=%d indexing...", session_id, len(contents))

    # The chat index is a nice-to-have. If building it fails (e.g. the
    # embedding model can't load on a small instance), do NOT fail the upload —
    # /analyze doesn't need the index, and /chat will retry indexing on demand.
    chunk_count = 0
    chat_ready = False
    try:
        chunk_count = _index_resume(session_id, file_path)
        chat_ready = True
        log.info("upload: session=%s chunks=%d", session_id, chunk_count)
    except ValueError as exc:
        # PDF genuinely has no indexable content — real client error.
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception:  # noqa: BLE001
        log.exception("upload: indexing failed for session=%s (chat degraded, analyze unaffected)", session_id)

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
        "analyze: session=%s role=%s resume_chars=%d",
        payload.session_id,
        payload.target_role,
        len(resume_text),
    )

    try:
        analyzer = ResumeAnalyzer()
        result = analyzer.analyze(resume_text, payload.target_role)
    except RuntimeError as exc:
        # Config problem (missing GEMINI_API_KEY) — not the user's fault.
        log.error("analyze: config error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except ValueError as exc:
        # Model returned something unparseable / empty.
        log.error("analyze: bad LLM response: %s", exc)
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001 — surface a clean 502, log the rest
        log.exception("analyze: unexpected failure")
        raise HTTPException(
            status_code=502,
            detail="The AI model call failed. Please try again.",
        ) from exc

    log.info(
        "analyze: session=%s done overall=%s ats=%s",
        payload.session_id,
        result.get("overallScore"),
        result.get("atsScore"),
    )
    return {"success": True, "analysis": result}


@app.post("/chat")
def chat(payload: ChatRequest):  # sync: embedding + Gemini calls block, see /analyze note
    from services.rag import RAGEngine  # lazy: pulls torch, see module note

    engine = RAGEngine(namespace=_resume_namespace(payload.session_id))

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
            log.info("chat: session=%s index missing, building on demand", payload.session_id)
            engine.ingest_document(pdf_path)
        except Exception as exc:  # noqa: BLE001
            log.exception("chat: on-demand indexing failed for session=%s", payload.session_id)
            raise HTTPException(
                status_code=503,
                detail="The resume chat assistant is temporarily unavailable. Your analysis above is unaffected.",
            ) from exc

    try:
        answer = engine.answer(payload.question, top_k=config.TOP_K)
    except RuntimeError as exc:
        log.error("chat: LLM error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        log.exception("chat: unexpected failure")
        raise HTTPException(status_code=502, detail="The AI assistant failed to answer. Please try again.") from exc

    return {"success": True, "answer": answer}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=config.PORT, reload=True)
