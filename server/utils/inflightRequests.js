/**
 * In-flight request de-duplication, keyed by caller-supplied string.
 *
 * Defense-in-depth for routes/resume.js's /analyze: if two requests for the
 * SAME user + resume session + target role land while the first is still
 * running (a frontend race, a client retry, a second tab), the second one
 * reuses the first's in-flight promise instead of starting a second Gemini
 * pipeline. Never shares across different keys, so isolation between users/
 * sessions is exactly as strong as the key the caller builds.
 *
 * Process-local (a plain Map) — correct for a single Express instance. If
 * this service ever runs multiple instances behind a load balancer, this
 * stops deduplicating requests routed to different instances; the frontend
 * ref-guard and the AI-service-side concurrency cap still hold regardless.
 */
const inflight = new Map()

/**
 * @param {string} key
 * @param {() => Promise<any>} fn
 * @returns {Promise<any>} the shared result for concurrent callers with the same key
 */
function dedupe(key, fn) {
  const existing = inflight.get(key)
  if (existing) {
    return existing
  }

  const promise = Promise.resolve()
    .then(fn)
    .finally(() => {
      if (inflight.get(key) === promise) {
        inflight.delete(key)
      }
    })

  inflight.set(key, promise)
  return promise
}

/** True if a request for this key is currently in flight (for logging only). */
function has(key) {
  return inflight.has(key)
}

module.exports = { dedupe, has }
