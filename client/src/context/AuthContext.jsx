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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        // For now, create a mock user since we don't have a working auth system
        const mockUser = {
          id: '1',
          name: 'Sakshya Sinha',
          email: 'sakshya.sinha@campus.edu',
          department: 'Computer Science',
          year: '3rd Year',
          avatar: null
        }
        setUser(mockUser)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      
      // Mock login - in real app, this would call authService.login
      const mockUser = {
        id: '1',
        name: credentials.email.split('@')[0],
        email: credentials.email,
        department: 'Computer Science',
        year: '3rd Year',
        avatar: null
      }
      
      // Store mock token
      localStorage.setItem('token', 'mock-jwt-token')
      
      setUser(mockUser)
      setIsAuthenticated(true)
      
      return { success: true, user: mockUser }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      
      // Mock registration
      const mockUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        department: userData.department,
        year: userData.year,
        avatar: null
      }
      
      localStorage.setItem('token', 'mock-jwt-token')
      
      setUser(mockUser)
      setIsAuthenticated(true)
      
      return { success: true, user: mockUser }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}