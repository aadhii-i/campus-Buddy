"""
Text chunking.

Splits raw text into overlapping, word-bounded chunks so each chunk stays
small enough to embed meaningfully while keeping some context across chunk
boundaries. No external NLP dependency — this is deliberately simple and
fast, and works the same for a resume, an FAQ doc, or placement notes.
"""
from typing import List

from config import CHUNK_OVERLAP, CHUNK_SIZE


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    words = text.split()
    if not words:
        return []

    step = max(chunk_size - overlap, 1)
    chunks = []

    for start in range(0, len(words), step):
        chunk_words = words[start:start + chunk_size]
        if not chunk_words:
            break
        chunks.append(" ".join(chunk_words))
        if start + chunk_size >= len(words):
            break

    return chunks
