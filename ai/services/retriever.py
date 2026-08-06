"""
Retrieval.

Thin glue between an embedder and a vector store: embed the question, ask
the store for the nearest chunks.
"""
from typing import List

from services.embeddings import EmbeddingModel
from services.vector_store import VectorStore


class Retriever:
    def __init__(self, store: VectorStore, embedder: EmbeddingModel):
        self.store = store
        self.embedder = embedder

    def retrieve(self, question: str, top_k: int = 5) -> List[str]:
        query_embedding = self.embedder.embed_query(question)
        return self.store.search(query_embedding, top_k=top_k)
