import { apiService } from './api'
import toast from 'react-hot-toast'

// express-validator failures come back as { message: 'Validation failed', errors: [{ msg, param }] }.
// Surface the first field-level message instead of the generic wrapper so
// users (and future debugging) actually see what's wrong.
const extractErrorMessage = (error, fallback) => {
  const fieldError = error.response?.data?.errors?.[0]?.msg
  return fieldError || error.response?.data?.message || fallback
}

// Distinguish "the server said no" (wrong password, validation) from "the
// request never got a proper response" (server down, DNS, CORS, timeout).
// The two need different messages and are tested separately.
const reportAuthError = (error, credentialFallback) => {
  if (error.response) {
    toast.error(extractErrorMessage(error, credentialFallback))
  } else if (error.code === 'ECONNABORTED') {
    toast.error('The server took too long to respond. Please try again.')
  } else {
    toast.error('Cannot reach the server. Check your connection and that the backend is running.')
  }
}

const persistSession = ({ token, refreshToken, user }) => {
  if (token) localStorage.setItem('token', token)
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
  if (user) localStorage.setItem('user', JSON.stringify(user))
}

const clearSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await apiService.auth.login(credentials)
      const { token, refreshToken, user } = response.data

      persistSession({ token, refreshToken, user })
      toast.success(`Welcome back, ${user.name}!`)

      return { token, user }
    } catch (error) {
      reportAuthError(error, 'Login failed')
      throw error
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await apiService.auth.register(userData)
      const { token, refreshToken, user } = response.data

      persistSession({ token, refreshToken, user })
      toast.success(`Welcome to Campus Buddy, ${user.name}!`)

      return { token, user }
    } catch (error) {
      reportAuthError(error, 'Registration failed')
      throw error
    }
  },

  // Sign in with a Google Identity Services credential (ID token)
  async loginWithGoogle(idToken) {
    try {
      const response = await apiService.auth.googleLogin(idToken)
      const { token, refreshToken, user } = response.data

      persistSession({ token, refreshToken, user })
      toast.success(`Welcome, ${user.name}!`)

      return { token, user }
    } catch (error) {
      reportAuthError(error, 'Google sign-in failed')
      throw error
    }
  },

  // Logout user
  async logout() {
    try {
      await apiService.auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearSession()
      toast.success('Logged out successfully')
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiService.auth.getCurrentUser()
      const user = response.data.user
      localStorage.setItem('user', JSON.stringify(user))
      return user
    } catch (error) {
      // Only drop the stored session if the server actively rejected the
      // token. A network blip must not log the user out.
      if (error.response?.status === 401) {
        clearSession()
      }
      throw error
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('token')
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await apiService.auth.refreshToken()
      const { token } = response.data
      localStorage.setItem('token', token)
      return token
    } catch (error) {
      localStorage.removeItem('token')
      throw error
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      await apiService.auth.forgotPassword(email)
      toast.success('Password reset link sent to your email')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset link'
      toast.error(message)
      throw error
    }
  },

  // Reset password
  async resetPassword(token, password) {
    try {
      await apiService.auth.resetPassword(token, password)
      toast.success('Password reset successful')
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed'
      toast.error(message)
      throw error
    }
  }
}