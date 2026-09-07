"""
Central configuration for the Campus Buddy AI service.

Every tunable value (models, chunking, retrieval, CORS, storage paths) lives
here so the rest of the codebase never reads os.environ directly.
"""
import os

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# --- Storage ---
# DATA_DIR lets a deployment point uploads + the vector index at a mounted
# persistent disk (Render disk, Docker volume, ...) so a restart between
# "upload" and "analyze" doesn't lose the session. Defaults to the repo folder
# for local dev, where it doesn't matter.
DATA_DIR = os.getenv("DATA_DIR", BASE_DIR)
UPLOAD_DIR = os.path.join(DATA_DIR, "uploads")
VECTOR_DB_DIR = os.path.join(DATA_DIR, "vector_db")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(VECTOR_DB_DIR, exist_ok=True)

# --- Embeddings ---
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

# --- Chunking ---
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "400"))       # words per chunk
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "50"))  # overlapping words between chunks

# --- Retrieval ---
TOP_K = int(os.getenv("TOP_K", "5"))

# --- Gemini ---
# gemini-1.5-* (retired Sept 2025) and gemini-2.0-flash (retired 2026) both now
# 404 on the generateContent endpoint. gemini-3.6-flash is the current GA Flash
# model on the same (still fully supported) generateContent API. Override via
# the GEMINI_MODEL env var.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
# Used only when GEMINI_MODEL keeps failing with a transient 429/503 after
# retries — a different current Flash model, not a retried/older one.
GEMINI_FALLBACK_MODEL = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-3.5-flash")
# Per-request timeout so a stuck Gemini call can't hold a FastAPI worker
# thread indefinitely. Comfortably below Express's AI_SERVICE_TIMEOUT_MS
# (120s) even across 3 retries + 1 fallback attempt with backoff.
GEMINI_TIMEOUT_MS = int(os.getenv("GEMINI_TIMEOUT_MS", "20000"))

# --- Server ---
PORT = int(os.getenv("PORT", "8000"))
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:3002,http://localhost:5173",
    ).split(",")
    if origin.strip()
]

# --- Shared fallback message when the knowledge base has no relevant answer ---
DEFAULT_NOT_FOUND_MESSAGE = "I couldn't find this information in your uploaded resume."
