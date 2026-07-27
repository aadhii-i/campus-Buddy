/**
 * Format date to readable string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  return new Date(date).toLocaleDateString('en-US', defaultOptions)
}

/**
 * Format time to readable string
 */
export const formatTime = (time) => {
  if (!time) return ''
  
  const [hours, minutes] = time.split(':')
  const date = new Date()
  date.setHours(parseInt(hours), parseInt(minutes))
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now - targetDate) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return formatDate(date, { month: 'short', day: 'numeric' })
}

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const today = new Date()
  const targetDate = new Date(date)
  
  return today.toDateString() === targetDate.toDateString()
}

/**
 * Check if date is upcoming (within next 7 days)
 */
export const isUpcoming = (date) => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24))
  
  return diffInDays >= 0 && diffInDays <= 7
}

/**
 * Get days until event
 */
export const getDaysUntil = (date) => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 0) return 'Past event'
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Tomorrow'
  
  return `${diffInDays} days`
}