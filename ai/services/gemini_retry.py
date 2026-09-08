"""
Retry/fallback wrapper around a single Gemini generate_content() call.

analyzer.py and llm.py each make exactly one such call; both need the same
handling for transient failures, so it lives here once instead of being
duplicated. Anything that is not one of the three categories below (bad
request, invalid model, auth failure, quota exhausted permanently, ...) is
raised immediately — retrying or swapping models would not fix those.

Three distinct failure categories, handled differently on purpose:
  - 503 (overload) / timeout: transient, the SAME model is likely to succeed
    a few seconds later -> bounded retries with exponential backoff+jitter.
  - 429 (RESOURCE_EXHAUSTED): retrying the SAME model within seconds spends
    more of the same already-exhausted quota window and makes it worse -> at
    most GEMINI_RATE_LIMIT_MAX_RETRIES attempts (default 1, i.e. no retry),
    honoring Google's own suggested retryDelay when it provides one, then
    straight to the fallback model (a separate quota bucket). If the
    fallback is ALSO rate-limited, this is very likely genuine account/
    project-level quota exhaustion, not a bug here — raised as
    GeminiRateLimitedError so the caller can return a clear, distinct
    "AI_RATE_LIMITED" error instead of retrying further.
"""
import logging
import random
import threading
import time
from typing import Any, Optional

import httpx
from google.genai import errors as genai_errors

from config import (
    GEMINI_MAX_RETRIES,
    GEMINI_RATE_LIMIT_MAX_RETRIES,
    GEMINI_RETRY_BASE_DELAY,
    MAX_GEMINI_CONCURRENCY,
)

log = logging.getLogger(__name__)

# Never block a single request for longer than this waiting between retries,
# even if Google's own RetryInfo suggests longer — better to fail fast with a
# clear error than tie up a FastAPI worker thread for a long, uncertain wait.
MAX_BACKOFF_SECONDS = 10.0

# Bounds how many Gemini calls this process can have in flight at once across
# ALL requests (analyze + chat, all users) — a concurrency cap, not a
# per-request retry count. Prevents a burst of traffic from itself triggering
# the rate limit this module is trying to protect against.
_concurrency_semaphore = threading.Semaphore(MAX_GEMINI_CONCURRENCY)


class GeminiRateLimitedError(RuntimeError):
    """429 / RESOURCE_EXHAUSTED on every model tried. The provider quota is
    genuinely exhausted for now — retrying again immediately will not help."""


class GeminiTimeoutError(RuntimeError):
    """The request(s) to Gemini timed out, even after bounded retries."""


def _extract_retry_delay_seconds(exc: genai_errors.APIError) -> Optional[float]:
    """Best-effort read of Google's own suggested wait (RetryInfo.retryDelay,
    e.g. "34s") out of a 429 error body. Returns None if absent/unparseable —
    callers fall back to their own exponential backoff in that case."""
    try:
        details = getattr(exc, "details", None)
        error_obj = details.get("error", details) if isinstance(details, dict) else {}
        for item in (error_obj.get("details") or []):
            if isinstance(item, dict) and isinstance(item.get("retryDelay"), str):
                raw = item["retryDelay"]
                if raw.endswith("s"):
                    return float(raw[:-1])
    except (AttributeError, TypeError, ValueError):
        pass
    return None


def _call_with_retries(client: Any, model: str, contents: Any, config: Any, tag: str):
    """One model, bounded retries. Returns the response on success.

    Raises the original exception immediately for anything non-retryable.
    Raises GeminiRateLimitedError / GeminiTimeoutError / the last APIError
    once THIS model's retry budget for that category is exhausted — the
    caller (generate_content_with_retry) decides whether a fallback model
    is worth trying next.
    """
    attempt = 0
    while True:
        attempt += 1
        try:
            resp = client.models.generate_content(model=model, contents=contents, config=config)
            log.info("%s generate_content OK model=%r attempt=%d", tag, model, attempt)
            return resp
        except genai_errors.APIError as exc:
            status_code = getattr(exc, "code", None)
            if status_code == 429:
                max_attempts = GEMINI_RATE_LIMIT_MAX_RETRIES
                kind = "rate_limited"
            elif status_code == 503:
                max_attempts = GEMINI_MAX_RETRIES
                kind = "overload"
            else:
                log.warning(
                    "%s generate_content failed model=%r attempt=%d status=%s (non-retryable): %s",
                    tag, model, attempt, status_code, exc,
                )
                raise

            log.warning(
                "%s generate_content failed model=%r attempt=%d/%d status=%s kind=%s: %s",
                tag, model, attempt, max_attempts, status_code, kind, exc,
            )
            if attempt >= max_attempts:
                raise

            delay = _extract_retry_delay_seconds(exc) if kind == "rate_limited" else None
            if delay is None:
                delay = GEMINI_RETRY_BASE_DELAY * (2 ** (attempt - 1))
            delay = min(delay, MAX_BACKOFF_SECONDS) + random.uniform(0, 0.5)
            time.sleep(delay)
        except httpx.TimeoutException as exc:
            log.warning(
                "%s generate_content TIMEOUT model=%r attempt=%d/%d: %s",
                tag, model, attempt, GEMINI_MAX_RETRIES, exc,
            )
            if attempt >= GEMINI_MAX_RETRIES:
                raise
            delay = min(GEMINI_RETRY_BASE_DELAY * (2 ** (attempt - 1)), MAX_BACKOFF_SECONDS)
            time.sleep(delay + random.uniform(0, 0.5))


def generate_content_with_retry(
    client: Any,
    *,
    model: str,
    contents: Any,
    config: Any = None,
    fallback_model: Optional[str] = None,
    log_context: str = "",
) -> Any:
    """client.models.generate_content with bounded, category-aware retries,
    then one attempt on `fallback_model` (if given and different from
    `model`) before giving up. Bounded by MAX_GEMINI_CONCURRENCY across the
    whole process so a burst of requests can't itself trigger a rate limit.
    """
    tag = f"[Gemini{f' {log_context}' if log_context else ''}]"

    with _concurrency_semaphore:
        try:
            return _call_with_retries(client, model, contents, config, tag)
        except genai_errors.APIError as exc:
            status_code = getattr(exc, "code", None)
            if status_code not in (429, 503):
                raise  # non-retryable — no fallback, fail exactly as before
            primary_exc, primary_kind = exc, ("rate_limited" if status_code == 429 else "overload")
        except httpx.TimeoutException as exc:
            primary_exc, primary_kind = exc, "timeout"

        if not fallback_model or fallback_model == model:
            if primary_kind == "rate_limited":
                raise GeminiRateLimitedError(f"Gemini rate-limited (429) on {model!r}, no fallback configured") from primary_exc
            if primary_kind == "timeout":
                raise GeminiTimeoutError(f"Gemini request timed out for model {model!r}, no fallback configured") from primary_exc
            raise RuntimeError(f"Gemini request failed after retries on {model!r}: {type(primary_exc).__name__}: {primary_exc}") from primary_exc

        log.warning(
            "%s primary model %r exhausted retries (kind=%s), trying fallback model %r",
            tag, model, primary_kind, fallback_model,
        )
        try:
            return _call_with_retries(client, fallback_model, contents, config, tag)
        except genai_errors.APIError as exc:
            fb_status = getattr(exc, "code", None)
            log.error("%s fallback model %r also failed status=%s: %s", tag, fallback_model, fb_status, exc)
            if fb_status == 429:
                raise GeminiRateLimitedError(
                    f"Gemini rate-limited (429) on both {model!r} and fallback {fallback_model!r}"
                ) from exc
            raise RuntimeError(
                f"Gemini request failed on {model!r} and fallback {fallback_model!r}: {type(exc).__name__}: {exc}"
            ) from exc
        except httpx.TimeoutException as exc:
            log.error("%s fallback model %r also timed out: %s", tag, fallback_model, exc)
            raise GeminiTimeoutError(f"Gemini request timed out on {model!r} and fallback {fallback_model!r}") from exc
