import React, { useEffect, useRef, useId } from 'react'

const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

// Loads the Google Identity Services script once per page (safe to call
// from multiple mounted instances) and resolves when window.google is ready.
let gsiLoadPromise = null
const loadGsiScript = () => {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (!gsiLoadPromise) {
    gsiLoadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${GSI_SCRIPT_SRC}"]`)
      if (existing) {
        existing.addEventListener('load', () => resolve())
        existing.addEventListener('error', reject)
        return
      }
      const script = document.createElement('script')
      script.src = GSI_SCRIPT_SRC
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  return gsiLoadPromise
}

// Renders Google's own "Sign in with Google" button and forwards the signed
// ID token it produces to onCredential — no popup/redirect flow to wire up,
// Google Identity Services handles the whole interaction.
const GoogleSignInButton = ({ onCredential, text = 'continue_with' }) => {
  const containerRef = useRef(null)
  const domId = useId()
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId) return
    let cancelled = false

    loadGsiScript()
      .then(() => {
        if (cancelled || !containerRef.current) return
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredential(response.credential)
        })
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text
        })
      })
      .catch(() => {
        // Silent: if the script fails to load (offline, blocked), the
        // container just stays empty — email/password login is unaffected.
      })

    return () => { cancelled = true }
  }, [clientId, onCredential, text])

  if (!clientId) return null

  return <div id={`google-signin-${domId}`} ref={containerRef} className="flex justify-center" />
}

export default GoogleSignInButton
