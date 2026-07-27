import { apiService } from './api'
import toast from 'react-hot-toast'

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await apiService.auth.login(credentials)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      toast.success(`Welcome back, ${user.name}!`)
      
      return { token, user }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await apiService.auth.register(userData)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      toast.success(`Welcome to Campus Companion, ${user.name}!`)
      
      return { token, user }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
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
      localStorage.removeItem('token')
      toast.success('Logged out successfully')
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiService.auth.getCurrentUser()
      return response.data.user
    } catch (error) {
      localStorage.removeItem('token')
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