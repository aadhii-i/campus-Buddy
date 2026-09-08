"""
LLM wrapper (Google Gemini).

Owns the exact prompt template and the call to the model. Nothing else in
the codebase should know how a prompt is built or which provider answers
it — swapping Gemini for another model later only touches this file.
"""
import logging

from google import genai
from google.genai import types

from config import GEMINI_API_KEY, GEMINI_FALLBACK_MODEL, GEMINI_MODEL, GEMINI_TIMEOUT_MS
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
        if not GEMINI_API_KEY:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured. Set it in ai/.env before asking questions."
            )
        # google-genai SDK: one Client per key; the model is chosen per request.
        self._client = genai.Client(
            api_key=GEMINI_API_KEY,
            http_options=types.HttpOptions(timeout=GEMINI_TIMEOUT_MS),
        )

    def generate_answer(self, context_chunks: list[str], question: str, request_id: str = "") -> str:
        context = "\n\n---\n\n".join(context_chunks)
        prompt = SYSTEM_PROMPT_TEMPLATE.format(context=context, question=question)

        try:
            response = generate_content_with_retry(
                self._client,
                model=GEMINI_MODEL,
                contents=prompt,
                fallback_model=GEMINI_FALLBACK_MODEL,
                log_context=f"chat:{request_id}" if request_id else "chat",
            )
        except (GeminiRateLimitedError, GeminiTimeoutError):
            raise  # already categorized + logged in gemini_retry.py
        except Exception as exc:  # google.genai.errors.APIError and transport errors
            log.error(
                "Gemini generate_content failed (model=%r): %s: %s",
                GEMINI_MODEL, type(exc).__name__, exc,
            )
            raise RuntimeError(f"Gemini request failed ({type(exc).__name__}): {exc}") from exc

        return (response.text or "").strip()

    def close(self) -> None:
        """Release the underlying HTTP session. Called when a cached
        RAGEngine (see services.rag) is evicted."""
        self._client.close()
