"""
FAISS-backed vector store.

Each knowledge base (a resume, a placement FAQ set, department notes, ...)
gets its own on-disk index identified by a `namespace` string — that's the
only thing that changes when this is reused for a different feature.
Index + chunk text are persisted so a session survives an AI-service
restart.
"""
import json
import os
from typing import List, Optional

import faiss
import numpy as np

from config import VECTOR_DB_DIR


class VectorStore:
    def __init__(self, namespace: str):
        self.namespace = namespace
        self._index_path = os.path.join(VECTOR_DB_DIR, f"{namespace}.index")
        self._meta_path = os.path.join(VECTOR_DB_DIR, f"{namespace}.json")

        self.index: Optional[faiss.Index] = None
        self.chunks: List[str] = []
        self._load()

    def _load(self) -> None:
        if os.path.exists(self._index_path) and os.path.exists(self._meta_path):
            self.index = faiss.read_index(self._index_path)
            with open(self._meta_path, "r", encoding="utf-8") as f:
                self.chunks = json.load(f)

    def _save(self) -> None:
        faiss.write_index(self.index, self._index_path)
        with open(self._meta_path, "w", encoding="utf-8") as f:
            json.dump(self.chunks, f)

    def exists(self) -> bool:
        return self.index is not None and self.index.ntotal > 0

    def add(self, chunks: List[str], embeddings: np.ndarray) -> None:
        if embeddings.shape[0] == 0:
            return

        if self.index is None:
            dimension = embeddings.shape[1]
            # Vectors are normalized at embed time, so inner product == cosine similarity.
            self.index = faiss.IndexFlatIP(dimension)

        self.index.add(embeddings)
        self.chunks.extend(chunks)
        self._save()

    def search(self, query_embedding: np.ndarray, top_k: int = 5) -> List[str]:
        if not self.exists():
            return []

        query = np.expand_dims(query_embedding, axis=0)
        k = min(top_k, self.index.ntotal)
        _scores, indices = self.index.search(query, k)

        return [self.chunks[i] for i in indices[0] if 0 <= i < len(self.chunks)]

    def clear(self) -> None:
        self.index = None
        self.chunks = []
        for path in (self._index_path, self._meta_path):
            if os.path.exists(path):
                os.remove(path)
