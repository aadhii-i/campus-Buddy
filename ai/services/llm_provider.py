"""
LLM provider selection (Groq or Gemini).

Both providers are exposed through the same tiny surface the rest of the
service already uses:

    client = make_client()
    resp = client.models.generate_content(model=..., contents=prompt, config=json_config())
    resp.text

so services.gemini_retry (retries, fallback model, concurrency cap) and the
analyzer / chat code work unchanged whichever provider is active. The active
provider comes from config.LLM_PROVIDER.
"""
import logging
from types import SimpleNamespace
from typing import Any, Optional

import httpx

import config

log = logging.getLogger(__name__)


class ProviderAPIError(RuntimeError):
    """Non-2xx response from an HTTP LLM provider. `code` is the HTTP status,
    matching google.genai.errors.APIError.code so retry logic can treat both
    the same way; `retry_after` is the provider's suggested wait in seconds."""

    def __init__(self, code: int, message: str, retry_after: Optional[float] = None):
        super().__init__(f"{code} {message}")
        self.code = code
        self.retry_after = retry_after


class GroqClient:
    """Minimal client for Groq's OpenAI-compatible /chat/completions API."""

    def __init__(self, api_key: str, base_url: str, timeout_ms: int):
        self._http = httpx.Client(
            base_url=base_url.rstrip("/"),
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=timeout_ms / 1000,
        )
        # Mirror google-genai's `client.models.generate_content(...)` shape.
        self.models = self

    def generate_content(self, *, model: str, contents: str, config: Any = None) -> SimpleNamespace:
        body = {"model": model, "messages": [{"role": "user", "content": contents}]}
        if isinstance(config, dict) and config.get("json"):
            body["response_format"] = {"type": "json_object"}

        resp = self._http.post("/chat/completions", json=body)
        if resp.status_code >= 400:
            raise ProviderAPIError(resp.status_code, _error_message(resp), _retry_after(resp))

        choices = resp.json().get("choices") or []
        text = (choices[0].get("message") or {}).get("content") if choices else None
        return SimpleNamespace(text=text or "")

    def close(self) -> None:
        self._http.close()


def _error_message(resp: httpx.Response) -> str:
    try:
        err = resp.json().get("error") or {}
        return err.get("message") or resp.text[:300]
    except ValueError:
        return resp.text[:300]


def _retry_after(resp: httpx.Response) -> Optional[float]:
    try:
        return float(resp.headers.get("retry-after"))
    except (TypeError, ValueError):
        return None


def make_client() -> Any:
    """Build a client for the active provider. Raises RuntimeError when its
    API key is missing (app.py maps that to one clean error response)."""
    if not config.LLM_API_KEY:
        raise RuntimeError(f"{config.LLM_API_KEY_NAME} is not configured. Set it in ai/.env.")

    if config.LLM_PROVIDER == "groq":
        return GroqClient(config.GROQ_API_KEY, config.GROQ_BASE_URL, config.GROQ_TIMEOUT_MS)

    from google import genai
    from google.genai import types

    # google-genai SDK: one Client per key; the model is chosen per request.
    return genai.Client(
        api_key=config.GEMINI_API_KEY,
        http_options=types.HttpOptions(timeout=config.GEMINI_TIMEOUT_MS),
    )


def json_config() -> Any:
    """Provider-specific "respond with JSON only" request option."""
    if config.LLM_PROVIDER == "groq":
        return {"json": True}

    from google.genai import types

    return types.GenerateContentConfig(response_mime_type="application/json")
