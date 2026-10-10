import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, GraduationCap, Building, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import GoogleSignInButton from './GoogleSignInButton'

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const initialFormData = {
    email: '',
    password: '',
    name: '',
    studentId: '',
    department: '',
    year: ''
  }
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(false)
  const { login, register, loginWithGoogle } = useAuth()

  const handleGoogleCredential = useCallback(async (idToken) => {
    setLoading(true)
    try {
      await loginWithGoogle(idToken)
      onClose()
    } catch {
      // authService.loginWithGoogle already surfaces a specific toast
      // (credentials vs. network); nothing else to do here.
    } finally {
      setLoading(false)
    }
  }, [loginWithGoogle, onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password })
      } else {
        await register({ ...formData, year: formData.year ? Number(formData.year) : undefined })
      }
      onClose()
    } catch {
      // authService already surfaced the precise reason (invalid credentials,
      // validation error, or network/server failure) via toast.
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData(initialFormData)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            className="modal-panel max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header bg-brand-200/60">
              <div className="flex items-center gap-2.5">
                <div className="icon-tile-dark h-9 w-9">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <h2 id="login-modal-title" className="text-lg font-bold text-midnight-900">
                  {isLogin ? 'Welcome back' : 'Create your account'}
                </h2>
              </div>
              <button onClick={onClose} aria-label="Close" className="btn-icon">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label htmlFor="login-name" className="form-label">Full name</label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-500" />
                      <input
                        type="text"
                        id="login-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required={!isLogin}
                        className="form-input pl-10"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="login-email" className="form-label">Email address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-500" />
                    <input
                      type="email"
                      id="login-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input pl-10"
                      placeholder="you@university.edu"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="form-label">Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-500" />
                    <input
                      type="password"
                      id="login-password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="form-input pl-10"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <label htmlFor="login-studentId" className="form-label">Student ID</label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-500" />
                        <input
                          type="text"
                          id="login-studentId"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                          required={!isLogin}
                          minLength={3}
                          maxLength={20}
                          className="form-input pl-10"
                          placeholder="e.g. CS21B001"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="login-department" className="form-label">Department</label>
                      <div className="relative">
                        <Building className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-500" />
                        <select
                          id="login-department"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          required={!isLogin}
                          className="form-select pl-10"
                        >
                          <option value="">Select department</option>
                          <option value="CSE">Computer Science (CSE)</option>
                          <option value="ECE">Electronics (ECE)</option>
                          <option value="ME">Mechanical (ME)</option>
                          <option value="CE">Civil (CE)</option>
                          <option value="EE">Electrical (EE)</option>
                          <option value="IT">Information Technology (IT)</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="login-year" className="form-label">Year</label>
                      <div className="relative">
                        <GraduationCap className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-500" />
                        <select
                          id="login-year"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required={!isLogin}
                          className="form-select pl-10"
                        >
                          <option value="">Select year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
                  {loading ? 'Loading…' : isLogin ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <div className="mt-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-midnight-900/10" />
                <span className="text-xs uppercase tracking-wide text-midnight-500">or</span>
                <div className="h-px flex-1 bg-midnight-900/10" />
              </div>

              <div className="mt-5">
                <GoogleSignInButton onCredential={handleGoogleCredential} />
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-midnight-500">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button onClick={toggleMode} className="link ml-1">
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoginModal
