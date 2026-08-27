const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const sendEmail = require('../utils/email')
const { verifyGoogleIdToken } = require('../utils/googleAuth')

// Errors User.findByCredentials/register are expected to throw for genuine
// credential problems — safe to show verbatim. Anything else (a DB error,
// a driver timeout, etc.) is an infrastructure problem, not the user's
// fault, and showing its raw message as a 401 would be actively misleading.
const KNOWN_AUTH_ERRORS = new Set([
  'Invalid login credentials',
  'Account is temporarily locked due to too many failed login attempts'
])

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  })
}

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  })
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { name, email, password, studentId, department, year } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { studentId }]
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Student ID already registered'
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      studentId,
      department,
      year: year || 1
    })

    // Generate tokens
    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Remove password from response
    user.password = undefined

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        year: user.year,
        role: user.role,
        avatar: user.avatar
      }
    })

    // Send welcome email (don't wait for it)
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Campus Buddy!',
        template: 'welcome',
        data: { name: user.name }
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
    }

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email, password } = req.body

    // Find user and include password
    const user = await User.findByCredentials(email, password)

    // Generate tokens
    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    res.json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        year: user.year,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    if (KNOWN_AUTH_ERRORS.has(error.message)) {
      return res.status(401).json({
        success: false,
        message: error.message
      })
    }
    // Not a recognized credential error (e.g. a DB/driver error) — this is
    // a server-side problem, not a wrong password, so don't call it one.
    res.status(500).json({
      success: false,
      message: 'Something went wrong while logging in. Please try again.'
    })
  }
}

// @desc    Sign in (or sign up) with a Google Identity Services ID token
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      })
    }

    let profile
    try {
      profile = await verifyGoogleIdToken(idToken)
    } catch (verifyError) {
      console.error('Google token verification failed:', verifyError.message)
      return res.status(401).json({
        success: false,
        message: 'Google sign-in verification failed'
      })
    }

    // Prefer an account already linked to this Google ID. Otherwise, fall
    // back to an existing local account with the same email — Google has
    // already verified that email belongs to this person (email_verified
    // checked in verifyGoogleIdToken), so linking it is safe and prevents
    // ending up with two separate accounts for the same person.
    let user = await User.findOne({ googleId: profile.googleId })
    if (!user) {
      user = await User.findOne({ email: profile.email })
      if (user) {
        user.googleId = profile.googleId
        if (!user.avatar) user.avatar = profile.picture
        await user.save()
      }
    }

    if (!user) {
      // studentId/department aren't collected by the Google button — seed a
      // placeholder the user can edit afterwards from the existing Profile
      // page, same as any other profile field.
      user = await User.create({
        name: profile.name,
        email: profile.email,
        googleId: profile.googleId,
        authProvider: 'google',
        avatar: profile.picture,
        studentId: `G-${profile.googleId.slice(-10)}`,
        department: 'OTHER',
        emailVerified: true
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated.'
      })
    }

    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    user.lastLogin = new Date()
    await user.save()

    res.json({
      success: true,
      message: 'Google sign-in successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        year: user.year,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin
      }
    })
  } catch (error) {
    console.error('Google auth error:', error)
    res.status(500).json({
      success: false,
      message: 'Google sign-in failed. Please try again.'
    })
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user information'
    })
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const allowedFields = ['name', 'department', 'year', 'profile']
    const updates = {}

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key]
      }
    })

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    })
  }
}

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.id).select('+password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check current password
    const isCurrentPasswordCorrect = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    })
  }
}

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    
    // Find user
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      })
    }

    // Generate new tokens
    const newToken = generateToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)

    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    })
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // In a production app, you might want to blacklist the token
    res.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    })
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Hash token and set expiry
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save()

    // Send email
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`
    
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        template: 'password-reset',
        data: {
          name: user.name,
          resetUrl,
          expiryTime: '10 minutes'
        }
      })

      res.json({
        success: true,
        message: 'Password reset email sent'
      })
    } catch (emailError) {
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save()

      throw new Error('Email could not be sent')
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process password reset request'
    })
  }
}

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    // Get hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex')

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    // Set new password
    user.password = req.body.password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    // Generate new token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Password reset successful',
      token
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    })
  }
}

module.exports = {
  register,
  login,
  googleAuth,
  getMe,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword
}