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
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
VECTOR_DB_DIR = os.path.join(BASE_DIR, "vector_db")
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
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

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
