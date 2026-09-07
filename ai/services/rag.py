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
import logging
import threading
from collections import OrderedDict
from typing import List, Optional

from config import DEFAULT_NOT_FOUND_MESSAGE, TOP_K
from services.chunker import chunk_text
from services.embeddings import get_embedder
from services.llm import GeminiClient
from services.parser import extract_text_from_pdf
from services.retriever import Retriever
from services.vector_store import VectorStore

log = logging.getLogger(__name__)


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

    def answer(self, question: str, top_k: int = TOP_K) -> str:
        if not self.store.exists():
            log.info("answer: namespace=%s no index yet (empty context)", self.namespace)
            return self.not_found_message

        chunks = self.retriever.retrieve(question, top_k=top_k)
        if not chunks:
            log.info("answer: namespace=%s retrieval returned no chunks (empty context)", self.namespace)
            return self.not_found_message

        answer = self.llm.generate_answer(chunks, question)
        return answer or self.not_found_message

    def close(self) -> None:
        """Release the Gemini client's HTTP session, if one was created."""
        if self._llm is not None:
            self._llm.close()


_engine_cache: "OrderedDict[str, RAGEngine]" = OrderedDict()
_engine_cache_lock = threading.Lock()
_MAX_CACHED_ENGINES = 100  # bounded so a long-running process doesn't grow forever


def get_rag_engine(namespace: str) -> RAGEngine:
    """Process-wide cache of RAGEngine per session/namespace.

    Without this, every /chat message for the same resume re-reads the FAISS
    index + chunk metadata off disk (VectorStore._load) and recreates the
    Gemini client, even though nothing changed since the previous message in
    that conversation. Reusing the engine across turns removes both.

    LRU-evicted at a bounded size so a long-running process doesn't
    accumulate one engine (and one open Gemini HTTP client) per resume
    session forever.
    """
    with _engine_cache_lock:
        engine = _engine_cache.get(namespace)
        if engine is not None:
            _engine_cache.move_to_end(namespace)
            return engine

        engine = RAGEngine(namespace=namespace)
        _engine_cache[namespace] = engine
        if len(_engine_cache) > _MAX_CACHED_ENGINES:
            _, evicted = _engine_cache.popitem(last=False)
            evicted.close()
        return engine
