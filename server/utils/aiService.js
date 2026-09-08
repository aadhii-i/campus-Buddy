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
 * Call a JSON or multipart endpoint on the AI service.
 *
 * @param {string} path            e.g. "/analyze"
 * @param {object} opts
 * @param {'GET'|'POST'} opts.method
 * @param {object}   [opts.json]      JSON body
 * @param {FormData} [opts.formData]  multipart body (mutually exclusive with json)
 * @param {string}   [opts.requestId] correlation id for logs
 * @returns {Promise<object>} parsed JSON response body
 * @throws  {AiServiceError}
 */
async function callAiService(path, { method = 'POST', json, formData, requestId = '-' } = {}) {
  const url = `${AI_BASE_URL}${path}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), AI_SERVICE_TIMEOUT_MS)
  const startedAt = Date.now()

  const headers = {}
  let body
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(json)
  } else if (formData !== undefined) {
    body = formData // fetch sets the multipart boundary itself
  }

  let response
  try {
    response = await fetch(url, { method, headers, body, signal: controller.signal })
  } catch (err) {
    clearTimeout(timer)
    const timedOut = err.name === 'AbortError'
    const elapsed = Date.now() - startedAt
    console.error(
      `[resume][${requestId}] AI ${timedOut ? 'TIMEOUT' : 'UNREACHABLE'} ${method} ${url} (${elapsed}ms): ${err.message}`
    )
    throw new AiServiceError(
      timedOut
        ? 'The AI service is taking too long to respond. Please try again in a moment.'
        : 'The AI service is currently unavailable. Please try again in a moment.',
      {
        status: timedOut ? 504 : 503,
        kind: timedOut ? 'ai_timeout' : 'ai_unavailable',
        detail: err.message
      }
    )
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
    // to distinguish (rate limit, timeout) — handle both shapes.
    const detailObj = data && typeof data.detail === 'object' && data.detail !== null ? data.detail : null
    const structuredCode = detailObj?.code || null
    const detailMessage = detailObj?.message || (typeof data.detail === 'string' ? data.detail : null)

    console.error(
      `[resume][${requestId}] AI ${response.status} ${method} ${url} (${elapsed}ms): ${JSON.stringify(data).slice(0, 400)}`
    )

    const isClientError = response.status >= 400 && response.status < 500
    // 429 (rate limited) and 504 (timeout) carry real meaning for the
    // frontend — pass them through as-is instead of collapsing every
    // non-4xx failure to a generic 502.
    const preserveStatus = response.status === 429 || response.status === 504

    let kind = isClientError ? 'ai_bad_request' : 'ai_error'
    if (structuredCode === 'AI_RATE_LIMITED') kind = 'ai_rate_limited'
    else if (structuredCode === 'AI_TIMEOUT') kind = 'ai_timeout'

    throw new AiServiceError(
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
  }

  console.log(`[resume][${requestId}] AI ${response.status} ${method} ${path} ok (${elapsed}ms)`)
  return data
}

module.exports = { callAiService, AiServiceError, AI_BASE_URL, AI_SERVICE_TIMEOUT_MS }
