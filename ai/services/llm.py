"""
LLM wrapper (Groq or Google Gemini, per config.LLM_PROVIDER).

Owns the exact prompt template and the call to the model. Nothing else in
the codebase should know how a prompt is built or which provider answers
it — swapping Gemini for another model later only touches this file.
"""
import logging

from config import LLM_FALLBACK_MODEL, LLM_MODEL
from services.llm_provider import make_client
from services.gemini_retry import GeminiRateLimitedError, GeminiTimeoutError, generate_content_with_retry

log = logging.getLogger(__name__)

SYSTEM_PROMPT_TEMPLATE = """You are Campus Buddy Resume AI.

You answer ONLY using the retrieved resume context.

Never invent information.

If the answer is unavailable, clearly state that the information is not present in the uploaded resume.

Context:
{context}

Question:
{question}"""


class GeminiClient:
    def __init__(self):
        # Groq or Gemini, per config.LLM_PROVIDER. Raises RuntimeError if the
        # active provider's API key is missing.
        self._client = make_client()

    def generate_answer(self, context_chunks: list[str], question: str, request_id: str = "") -> str:
        context = "\n\n---\n\n".join(context_chunks)
        prompt = SYSTEM_PROMPT_TEMPLATE.format(context=context, question=question)

        try:
            response = generate_content_with_retry(
                self._client,
                model=LLM_MODEL,
                contents=prompt,
                fallback_model=LLM_FALLBACK_MODEL,
                log_context=f"chat:{request_id}" if request_id else "chat",
            )
        except (GeminiRateLimitedError, GeminiTimeoutError):
            raise  # already categorized + logged in gemini_retry.py
        except Exception as exc:  # provider API errors and transport errors
            log.error(
                "LLM generate_content failed (model=%r): %s: %s",
                LLM_MODEL, type(exc).__name__, exc,
            )
            raise RuntimeError(f"AI request failed ({type(exc).__name__}): {exc}") from exc

        return (response.text or "").strip()

    def close(self) -> None:
        """Release the underlying HTTP session. Called when a cached
        RAGEngine (see services.rag) is evicted."""
        self._client.close()
