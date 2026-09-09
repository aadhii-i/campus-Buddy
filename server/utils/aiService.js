/**
 * Thin client for the Campus Buddy Python AI service (FastAPI).
 *
 * Centralises the three things every resume route needs and used to repeat:
 *   1. resolving AI_SERVICE_URL correctly (no trailing slash, no stray /api),
 *   2. a hard timeout so a hung AI service can't hang the Express request,
 *   3. structured logging + typed errors so a failure is immediately
 *      attributable to "AI unreachable" vs "AI timed out" vs "AI rejected the
 *      request" vs "AI internal error".
 *
 * This is NOT a duplicate route/service — the routes in routes/resume.js still
 * own the HTTP contract with the browser; this only owns the hop to Python.
 */

// A resume analysis is: (cold-started Render dyno wake) + PDF re-parse + a
// full-resume Gemini generateContent call + JSON normalisation. 45s was too
// tight and turned a slow-but-successful analysis into a fake "timeout". 120s
// covers a cold start + a slow Gemini response with margin; the browser-side
// axios timeout for these routes is set higher still so Express always wins
// the race and returns a real, specific error instead of the client aborting.
const AI_SERVICE_TIMEOUT_MS = parseInt(process.env.AI_SERVICE_TIMEOUT_MS, 10) || 120000

// Bounded retry for a TRANSPORT-level failure between Node and the AI
// service (network blip, or a 429/502/503/504 from something in front of
// the app — Render's edge during a deploy/restart window, not the app
// itself: ai/app.py has no rate-limit code, and /upload never calls Gemini,
// so a 429 there cannot be a Gemini rate limit). Deliberately small and
// logged — this is not the same thing as an uncontrolled retry storm.
const AI_SERVICE_MAX_ATTEMPTS = parseInt(process.env.AI_SERVICE_MAX_ATTEMPTS, 10) || 2
const AI_SERVICE_RETRY_BASE_DELAY_MS = parseInt(process.env.AI_SERVICE_RETRY_BASE_DELAY_MS, 10) || 500
// Statuses worth one bounded retry when they DON'T carry our own app's
// structured { code: 'AI_RATE_LIMITED' | 'AI_TIMEOUT' } body — those are
// already the result of ai/app.py's own bounded Gemini retry+fallback, so
// retrying them again here would just double an already-decided outcome.
const TRANSIENT_RETRYABLE_STATUSES = new Set([429, 502, 503, 504])

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * The FastAPI service exposes /health, /upload, /analyze, /chat at the root —
 * it has no "/api" prefix. People habitually set AI_SERVICE_URL to
 * ".../api" or leave a trailing slash; normalise both away so a misconfigured
 * dashboard value doesn't turn into a silent 404.
 */
const resolveAiBaseUrl = () => {
  const raw = (process.env.AI_SERVICE_URL || 'http://localhost:8000').trim()
  return raw.replace(/\/+$/, '').replace(/\/api$/i, '')
}

const AI_BASE_URL = resolveAiBaseUrl()

class AiServiceError extends Error {
  constructor(message, { status = 502, kind = 'ai_error', detail } = {}) {
    super(message)
    this.name = 'AiServiceError'
    this.status = status
    this.kind = kind // ai_unavailable | ai_timeout | ai_rate_limited | ai_bad_request | ai_error
    this.detail = detail
  }
}

/**
 * One HTTP attempt to the AI service. Never retries — callAiService() below
 * owns the retry policy so every attempt (including retries) gets logged
 * the same way with its own attempt number.
 */
async function _attemptOnce(path, { method, json, formData, requestId, attempt }) {
  const url = `${AI_BASE_URL}${path}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), AI_SERVICE_TIMEOUT_MS)
  const startedAt = Date.now()

  const headers = { 'X-Request-Id': requestId }
  let body
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(json)
  } else if (formData !== undefined) {
    body = formData // fetch sets the multipart boundary itself — never overridden here
  }

  let response
  try {
    response = await fetch(url, { method, headers, body, signal: controller.signal })
  } catch (err) {
    clearTimeout(timer)
    const timedOut = err.name === 'AbortError'
    const elapsed = Date.now() - startedAt
    console.error(
      `[resume][${requestId}] AI ${timedOut ? 'TIMEOUT' : 'UNREACHABLE'} attempt=${attempt} ${method} ${url} (${elapsed}ms): ${err.message}`
    )
    const error = new AiServiceError(
      timedOut
        ? 'The AI service is taking too long to respond. Please try again in a moment.'
        : 'The AI service is currently unavailable. Please try again in a moment.',
      {
        status: timedOut ? 504 : 503,
        kind: timedOut ? 'ai_timeout' : 'ai_unavailable',
        detail: err.message
      }
    )
    // Retry a fast connection failure (DNS/refused/reset — plausible during a
    // brief deploy window). NEVER retry our OWN timeout: that already waited
    // the full AI_SERVICE_TIMEOUT_MS (120s) budget, so retrying would double
    // an already-long wait instead of recovering from a quick blip.
    error.retryable = !timedOut
    throw error
  }
  clearTimeout(timer)

  const rawText = await response.text()
  let data
  try {
    data = rawText ? JSON.parse(rawText) : {}
  } catch {
    data = { detail: rawText }
  }

  const elapsed = Date.now() - startedAt

  if (!response.ok) {
    // ai/app.py sends `detail` as a plain string for most errors, but as a
    // structured { code, message } object for the cases the frontend needs
    // to distinguish (rate limit, timeout) — handle both shapes. A PLAIN
    // STRING (or an unparseable body) on a 429/502/503/504 means this did
    // NOT come from our own app.py's deliberate error paths (those always
    // emit the structured object) — i.e. something in front of the app
    // (Render's edge, mid-deploy) rejected it before FastAPI ever saw it.
    const detailObj = data && typeof data.detail === 'object' && data.detail !== null ? data.detail : null
    const structuredCode = detailObj?.code || null
    const detailMessage = detailObj?.message || (typeof data.detail === 'string' ? data.detail : null)

    console.error(
      `[resume][${requestId}] AI ${response.status} attempt=${attempt} ${method} ${url} (${elapsed}ms) ` +
        `origin=${response.headers.get('x-render-origin-server') || 'none'}: ${JSON.stringify(data).slice(0, 400)}`
    )

    const isClientError = response.status >= 400 && response.status < 500
    // 429 (rate limited) and 504 (timeout) carry real meaning for the
    // frontend — pass them through as-is instead of collapsing every
    // non-4xx failure to a generic 502.
    const preserveStatus = response.status === 429 || response.status === 504

    let kind = isClientError ? 'ai_bad_request' : 'ai_error'
    if (structuredCode === 'AI_RATE_LIMITED') kind = 'ai_rate_limited'
    else if (structuredCode === 'AI_TIMEOUT') kind = 'ai_timeout'

    const error = new AiServiceError(
      detailMessage ||
        (isClientError
          ? 'The AI service could not process this request.'
          : 'The AI service failed to complete this request. Please try again shortly.'),
      {
        status: preserveStatus ? response.status : isClientError ? response.status : 502,
        kind,
        detail: detailMessage
      }
    )
    // Retry only a transient-looking failure with NO structured code from
    // our own app — a genuine AI_RATE_LIMITED/AI_TIMEOUT already went
    // through app.py's own bounded Gemini retry+fallback, so retrying it
    // again here would just repeat an already-settled outcome.
    error.retryable = TRANSIENT_RETRYABLE_STATUSES.has(response.status) && !structuredCode
    throw error
  }

  console.log(`[resume][${requestId}] AI ${response.status} attempt=${attempt} ${method} ${path} ok (${elapsed}ms)`)
  return data
}

/**
 * Call a JSON or multipart endpoint on the AI service, with a small bounded
 * retry for transient transport-level failures (see TRANSIENT_RETRYABLE_STATUSES).
 *
 * @param {string} path            e.g. "/analyze"
 * @param {object} opts
 * @param {'GET'|'POST'} opts.method
 * @param {object}   [opts.json]      JSON body
 * @param {FormData} [opts.formData]  multipart body (mutually exclusive with json)
 * @param {string}   [opts.requestId] correlation id for logs — also sent as X-Request-Id
 * @returns {Promise<object>} parsed JSON response body
 * @throws  {AiServiceError}
 */
async function callAiService(path, { method = 'POST', json, formData, requestId = '-' } = {}) {
  let lastError
  for (let attempt = 1; attempt <= AI_SERVICE_MAX_ATTEMPTS; attempt++) {
    try {
      return await _attemptOnce(path, { method, json, formData, requestId, attempt })
    } catch (error) {
      lastError = error
      const canRetry = error.retryable && attempt < AI_SERVICE_MAX_ATTEMPTS
      if (!canRetry) throw error

      const delay = AI_SERVICE_RETRY_BASE_DELAY_MS * attempt + Math.random() * 200
      console.warn(
        `[resume][${requestId}] AI transient failure on ${method} ${path}, retrying attempt=${attempt + 1}/${AI_SERVICE_MAX_ATTEMPTS} after ${Math.round(delay)}ms`
      )
      await sleep(delay)
    }
  }
  throw lastError
}

module.exports = { callAiService, AiServiceError, AI_BASE_URL, AI_SERVICE_TIMEOUT_MS }
