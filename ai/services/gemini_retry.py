"""
Retry/fallback wrapper around a single Gemini generate_content() call.

analyzer.py and llm.py each make exactly one such call; both need the same
handling for transient (429/503) failures, so it lives here once instead of
being duplicated. Anything that is NOT a 429/503 APIError (bad request,
invalid model, auth failure, quota exhausted permanently, ...) is raised
immediately — retrying or swapping models would not fix those.
"""
import logging
import random
import time
from typing import Any, Optional

from google.genai import errors as genai_errors

log = logging.getLogger(__name__)

MAX_ATTEMPTS = 3
RETRYABLE_STATUS_CODES = {429, 503}
BASE_BACKOFF_SECONDS = 1.0


def generate_content_with_retry(
    client: Any,
    *,
    model: str,
    contents: Any,
    config: Any = None,
    fallback_model: Optional[str] = None,
    log_context: str = "",
) -> Any:
    """client.models.generate_content with bounded retries + exponential
    backoff (with jitter) for 429/503, then one attempt on `fallback_model`
    (if given and different from `model`) before giving up.
    """
    tag = f"[Gemini{f' {log_context}' if log_context else ''}]"
    last_exc: Optional[Exception] = None

    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            return client.models.generate_content(model=model, contents=contents, config=config)
        except genai_errors.APIError as exc:
            last_exc = exc
            status_code = getattr(exc, "code", None)
            retryable = status_code in RETRYABLE_STATUS_CODES
            log.warning(
                "%s generate_content failed model=%r attempt=%d/%d status=%s retryable=%s: %s",
                tag, model, attempt, MAX_ATTEMPTS, status_code, retryable, exc,
            )
            if not retryable:
                raise
            if attempt < MAX_ATTEMPTS:
                backoff = BASE_BACKOFF_SECONDS * (2 ** (attempt - 1))
                backoff += random.uniform(0, backoff * 0.5)  # jitter
                time.sleep(backoff)

    # Primary model exhausted every retryable attempt. Try the fallback once.
    if fallback_model and fallback_model != model:
        log.warning(
            "%s primary model %r exhausted %d attempts (last status=%s), trying fallback model %r",
            tag, model, MAX_ATTEMPTS, getattr(last_exc, "code", None), fallback_model,
        )
        try:
            return client.models.generate_content(model=fallback_model, contents=contents, config=config)
        except genai_errors.APIError as exc:
            log.error(
                "%s fallback model %r also failed status=%s: %s",
                tag, fallback_model, getattr(exc, "code", None), exc,
            )
            last_exc = exc

    raise RuntimeError(
        f"Gemini request failed after {MAX_ATTEMPTS} attempts on {model!r}"
        + (f" and fallback {fallback_model!r}" if fallback_model and fallback_model != model else "")
        + f" (last error: {type(last_exc).__name__}: {last_exc})"
    ) from last_exc
