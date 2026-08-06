"""
Campus Buddy AI Service.

FastAPI entrypoint. Express calls this service; this service never talks to
MongoDB or holds business logic — it only turns documents into a searchable
index and answers questions against that index.
"""
import os
import uuid

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import config
from services.analyzer import ResumeAnalyzer
from services.parser import extract_text_from_pdf
from services.rag import RAGEngine
from services.roles import is_valid_role, list_roles

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


@app.get("/health")
def health():
    return {"status": "ok", "service": "campus-buddy-ai"}


@app.get("/roles")
def get_roles():
    return {"roles": list_roles()}


@app.post("/upload")
async def upload_resume(file: UploadFile = File(...), session_id: str = Form(None)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    session_id = session_id or str(uuid.uuid4())
    file_path = os.path.join(config.UPLOAD_DIR, f"{session_id}.pdf")

    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    engine = RAGEngine(namespace=_resume_namespace(session_id))
    try:
        chunk_count = engine.ingest_document(file_path)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {"success": True, "sessionId": session_id, "chunksIndexed": chunk_count}


@app.post("/analyze")
async def analyze_resume(payload: AnalyzeRequest):
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

    try:
        analyzer = ResumeAnalyzer()
        result = analyzer.analyze(resume_text, payload.target_role)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return {"success": True, "analysis": result}


@app.post("/chat")
async def chat(payload: ChatRequest):
    engine = RAGEngine(namespace=_resume_namespace(payload.session_id))

    if not engine.store.exists():
        raise HTTPException(
            status_code=404,
            detail="No resume indexed for this session. Please upload a resume first.",
        )

    try:
        answer = engine.answer(payload.question, top_k=config.TOP_K)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"success": True, "answer": answer}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=config.PORT, reload=True)
