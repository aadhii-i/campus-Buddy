"""
RAG orchestration.

RAGEngine wires parsing -> chunking -> embedding -> vector storage ->
retrieval -> LLM into two operations: ingest a document, answer a question.

It is deliberately generic — the resume chat feature is just
`RAGEngine(namespace="resume_<session_id>")`. Reusing this for a Campus
Placement Chatbot, College FAQs, Interview Experiences, Department Notes or
Placement Guides is a matter of picking a different `namespace` (and, if the
source isn't a PDF, calling `ingest_texts` instead of `ingest_document`) —
no other code changes.
"""
from typing import List, Optional

from config import DEFAULT_NOT_FOUND_MESSAGE
from services.chunker import chunk_text
from services.embeddings import get_embedder
from services.llm import GeminiClient
from services.parser import extract_text_from_pdf
from services.retriever import Retriever
from services.vector_store import VectorStore


class RAGEngine:
    def __init__(self, namespace: str, not_found_message: str = DEFAULT_NOT_FOUND_MESSAGE):
        self.namespace = namespace
        self.not_found_message = not_found_message

        self.store = VectorStore(namespace)
        self.embedder = get_embedder()
        self.retriever = Retriever(self.store, self.embedder)
        self._llm: Optional[GeminiClient] = None

    @property
    def llm(self) -> GeminiClient:
        # Created lazily so a missing GEMINI_API_KEY only breaks answer(),
        # not every import of this module.
        if self._llm is None:
            self._llm = GeminiClient()
        return self._llm

    def ingest_document(self, file_path: str) -> int:
        """Parse a PDF, chunk it, embed it, and store it. Returns chunk count."""
        text = extract_text_from_pdf(file_path)
        if not text.strip():
            raise ValueError("No extractable text found in this document.")
        return self.ingest_texts([text])

    def ingest_texts(self, texts: List[str]) -> int:
        """Chunk and store raw text directly — the hook other knowledge bases use."""
        chunks: List[str] = []
        for text in texts:
            chunks.extend(chunk_text(text))

        if not chunks:
            raise ValueError("No content to index.")

        embeddings = self.embedder.embed_texts(chunks)
        self.store.add(chunks, embeddings)
        return len(chunks)

    def answer(self, question: str, top_k: int = 5) -> str:
        if not self.store.exists():
            return self.not_found_message

        chunks = self.retriever.retrieve(question, top_k=top_k)
        if not chunks:
            return self.not_found_message

        answer = self.llm.generate_answer(chunks, question)
        return answer or self.not_found_message
