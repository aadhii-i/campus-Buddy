import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Best-effort read of the cached user so the UI can render an authenticated
// state immediately on refresh, before the /auth/me round-trip finishes.
const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const hasToken = !!localStorage.getItem('token')
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(hasToken)
  const [isAuthenticated, setIsAuthenticated] = useState(hasToken)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    checkAuthStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      setIsAuthenticated(true)
    } catch (error) {
      // authService.getCurrentUser only clears storage on a real 401. If the
      // token was rejected, drop the session; if it was just a network error,
      // keep the cached session so a flaky connection doesn't log the user out.
      if (error.response?.status === 401) {
        setUser(null)
        setIsAuthenticated(false)
      } else {
        console.error('Auth check failed (keeping cached session):', error.message)
        setIsAuthenticated(!!localStorage.getItem('token'))
      }
    } finally {
      setLoading(false)
    }
  }

  const openLoginModal = () => setShowLoginModal(true)
  const closeLoginModal = () => setShowLoginModal(false)

  const login = async (credentials) => {
    try {
      setLoading(true)
      const { user: loggedInUser } = await authService.login(credentials)
      setUser(loggedInUser)
      setIsAuthenticated(true)
      return { success: true, user: loggedInUser }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const { user: newUser } = await authService.register(userData)
      setUser(newUser)
      setIsAuthenticated(true)
      return { success: true, user: newUser }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (idToken) => {
    try {
      setLoading(true)
      const { user: loggedInUser } = await authService.loginWithGoogle(idToken)
      setUser(loggedInUser)
      setIsAuthenticated(true)
      return { success: true, user: loggedInUser }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    showLoginModal,
    openLoginModal,
    closeLoginModal,
    login,
    register,
    loginWithGoogle,
    logout,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
