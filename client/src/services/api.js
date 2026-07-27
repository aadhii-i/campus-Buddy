import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance with production-ready configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 15000, // Increased timeout for production
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable cookies for session management
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Enhanced response interceptor with retry logic
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const message = error.response?.data?.message || error.message || 'An error occurred'
    
    // Handle network errors with retry
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        return await api.request(originalRequest)
      } catch (retryError) {
        toast.error('Network error. Please check your connection.')
        return Promise.reject(retryError)
      }
    }
    
    // Handle different status codes
    if (error.response?.status === 401) {
      // Only force logout if not an event creation (or other allowed fallback)
      const isEventCreate = originalRequest?.url?.includes('/events') && originalRequest?.method === 'post';
      if (!isEventCreate) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/'
        toast.error('Session expired. Please log in again.')
      } else {
        toast.error('Not authorized to create event. Using local fallback.')
      }
    } else if (error.response?.status === 403) {
      toast.error('Access denied.')
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.')
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please wait a moment.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.')
    } else {
      // Only show toast for non-silent errors
      if (!originalRequest.silent) {
        toast.error(message)
      }
    }
    
    return Promise.reject(error)
  }
)

// API methods
export const apiService = {
  // Generic methods
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),

  // File upload
  uploadFile: (url, formData, onUploadProgress) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onUploadProgress
    })
  },

  // Health check
  healthCheck: () => api.get('/health'),

  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get('/auth/me'),
    refreshToken: () => api.post('/auth/refresh'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password })
  },

  // Events endpoints
  events: {
    getAll: (params = {}) => api.get('/events', { params }),
    getById: (id) => api.get(`/events/${id}`),
    create: (eventData) => api.post('/events', eventData),
    update: (id, eventData) => api.put(`/events/${id}`, eventData),
    delete: (id) => api.delete(`/events/${id}`),
    register: (id) => api.post(`/events/${id}/register`),
    unregister: (id) => api.delete(`/events/${id}/register`),
    getRegistrations: (id) => api.get(`/events/${id}/registrations`)
  },

  // Lost & Found endpoints
  lostFound: {
    getAll: (params = {}) => api.get('/lost-found', { params }),
    getById: (id) => api.get(`/lost-found/${id}`),
    create: (itemData) => api.post('/lost-found', itemData),
    update: (id, itemData) => api.put(`/lost-found/${id}`, itemData),
    delete: (id) => api.delete(`/lost-found/${id}`),
    markAsFound: (id) => api.patch(`/lost-found/${id}/found`),
    addComment: (id, comment) => api.post(`/lost-found/${id}/comments`, { comment })
  },

  // Community endpoints
  community: {
    getPosts: (params = {}) => api.get('/community', { params }),
    getPostById: (id) => api.get(`/community/${id}`),
    createPost: (postData) => api.post('/community', postData),
    updatePost: (id, postData) => api.put(`/community/${id}`, postData),
    deletePost: (id) => api.delete(`/community/${id}`),
    likePost: (id) => api.post(`/community/${id}/like`),
    unlikePost: (id) => api.delete(`/community/${id}/like`),
    addComment: (id, comment) => api.post(`/community/${id}/comments`, { comment }),
    deleteComment: (postId, commentId) => api.delete(`/community/${postId}/comments/${commentId}`)
  },

  // Placement endpoints
  placement: {
    getNews: (params = {}) => api.get('/placement', { params }),
    getNewsById: (id) => api.get(`/placement/${id}`),
    createNews: (newsData) => api.post('/placement', newsData),
    updateNews: (id, newsData) => api.put(`/placement/${id}`, newsData),
    deleteNews: (id) => api.delete(`/placement/${id}`),
    getStats: () => api.get('/placement/stats')
  },

  // Resume endpoints
  resume: {
    analyze: (resumeFile) => {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      return api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    getAnalysis: (id) => api.get(`/resume/analysis/${id}`),
    getRecommendations: (id) => api.get(`/resume/recommendations/${id}`),
    getUserAnalyses: () => api.get('/resume/user-analyses')
  }
}

export default api