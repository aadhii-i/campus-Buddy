/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  const errors = []
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`)
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number')
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: getPasswordStrength(password)
  }
}

/**
 * Get password strength score
 */
const getPasswordStrength = (password) => {
  let score = 0
  
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  
  if (score <= 2) return 'weak'
  if (score <= 4) return 'medium'
  return 'strong'
}

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`
  }
  return null
}

/**
 * Validate file type
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file) return null
  
  const fileExtension = file.name.split('.').pop().toLowerCase()
  if (!allowedTypes.includes(fileExtension)) {
    return `File type .${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
  }
  return null
}

/**
 * Validate file size
 */
export const validateFileSize = (file, maxSizeInMB) => {
  if (!file) return null
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  if (file.size > maxSizeInBytes) {
    return `File size must be less than ${maxSizeInMB}MB`
  }
  return null
}

/**
 * Comprehensive form validation
 */
export const validateForm = (data, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const value = data[field]
    const fieldRules = rules[field]
    
    // Check required
    if (fieldRules.required) {
      const requiredError = validateRequired(value, fieldRules.label || field)
      if (requiredError) {
        errors[field] = requiredError
        return
      }
    }
    
    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') return
    
    // Check email
    if (fieldRules.type === 'email' && !validateEmail(value)) {
      errors[field] = 'Please enter a valid email address'
    }
    
    // Check password
    if (fieldRules.type === 'password') {
      const passwordValidation = validatePassword(value)
      if (!passwordValidation.isValid) {
        errors[field] = passwordValidation.errors[0]
      }
    }
    
    // Check phone
    if (fieldRules.type === 'phone' && !validatePhone(value)) {
      errors[field] = 'Please enter a valid phone number'
    }
    
    // Check min length
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = `${fieldRules.label || field} must be at least ${fieldRules.minLength} characters`
    }
    
    // Check max length
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = `${fieldRules.label || field} must be no more than ${fieldRules.maxLength} characters`
    }
    
    // Custom validation
    if (fieldRules.custom) {
      const customError = fieldRules.custom(value)
      if (customError) {
        errors[field] = customError
      }
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}