const { OAuth2Client } = require('google-auth-library')

// Lazily constructed: throwing only once a Google sign-in is actually
// attempted (not at process boot) means the rest of the app keeps working
// fine on deployments that haven't configured Google sign-in yet.
let client = null
const getClient = () => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not configured on the server')
  }
  if (!client) {
    client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  }
  return client
}

// Verifies a Google Identity Services ID token (the credential produced by
// the "Sign in with Google" button) and returns the verified profile.
// Signature + audience + issuer + expiry are all checked by verifyIdToken
// itself — nothing here trusts unverified client input.
const verifyGoogleIdToken = async (idToken) => {
  const ticket = await getClient().verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  })
  const payload = ticket.getPayload()

  if (!payload.email_verified) {
    throw new Error('Google account email is not verified')
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split('@')[0],
    picture: payload.picture || null
  }
}

module.exports = { verifyGoogleIdToken }
