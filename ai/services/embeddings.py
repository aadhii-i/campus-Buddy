"""
Embedding generation.

Loads the Sentence-Transformers model once (it's the expensive part) and
exposes simple encode helpers. `get_embedder()` is the single entry point so
the rest of the app never has to worry about model lifecycle.
"""
from typing import List

import numpy as np

from config import EMBEDDING_MODEL


class EmbeddingModel:
    def __init__(self, model_name: str = EMBEDDING_MODEL):
        # Imported lazily: sentence-transformers pulls in torch (~hundreds of MB
        # of RSS). Only the resume-chat path (/upload, /chat) needs it, so the
        # /health and /analyze paths — and process startup — never pay that
        # cost. Keeps the service bootable on a 512MB instance.
        from sentence_transformers import SentenceTransformer

        self.model = SentenceTransformer(model_name)

    def embed_texts(self, texts: List[str]) -> np.ndarray:
        """Embed a batch of texts, L2-normalized so inner product == cosine similarity."""
        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=False,
        )
        return embeddings.astype("float32")

    def embed_query(self, text: str) -> np.ndarray:
        return self.embed_texts([text])[0]


_embedder_instance: EmbeddingModel | None = None


def get_embedder() -> EmbeddingModel:
    """Process-wide singleton so the model is loaded into memory only once."""
    global _embedder_instance
    if _embedder_instance is None:
        _embedder_instance = EmbeddingModel()
    return _embedder_instance
