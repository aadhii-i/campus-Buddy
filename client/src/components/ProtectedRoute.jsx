import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

// Gate a route behind authentication. While the initial /auth/me check is in
// flight we render a spinner instead of deciding — otherwise a valid session
// would be bounced to the home page on every refresh before it resolves
// (which is exactly the "logs me straight back out" bug).
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, openLoginModal } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error('Please log in to continue')
      openLoginModal()
    }
  }, [loading, isAuthenticated, openLoginModal])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-surface-50" role="status">
        <div className="w-12 h-12 rounded-full border-4 border-midnight-900 border-r-brand-200 animate-spin" />
        <span className="text-sm font-medium text-midnight-500">Checking your session…</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
