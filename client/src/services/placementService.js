import { apiService } from './api'
import toast from 'react-hot-toast'

export const placementService = {
  // Get all placement news
  async getAllNews(filters = {}) {
    try {
      const response = await apiService.placement.getNews(filters)
      return response.data
    } catch (error) {
      console.error('Failed to fetch placement news:', error)
      throw error
    }
  },

  // Get news by ID
  async getNewsById(id) {
    try {
      const response = await apiService.placement.getNewsById(id)
      return response.data.news
    } catch (error) {
      console.error('Failed to fetch news:', error)
      throw error
    }
  },

  // Create new placement news
  async createNews(newsData) {
    try {
      const response = await apiService.placement.createNews(newsData)
      toast.success('Placement news created successfully!')
      return response.data.news
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create news'
      toast.error(message)
      throw error
    }
  },

  // Update placement news
  async updateNews(id, newsData) {
    try {
      const response = await apiService.placement.updateNews(id, newsData)
      toast.success('Placement news updated successfully!')
      return response.data.news
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update news'
      toast.error(message)
      throw error
    }
  },

  // Delete placement news
  async deleteNews(id) {
    try {
      await apiService.placement.deleteNews(id)
      toast.success('Placement news deleted successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete news'
      toast.error(message)
      throw error
    }
  },

  // Get placement statistics
  async getStats() {
    try {
      const response = await apiService.placement.getStats()
      return response.data.stats
    } catch (error) {
      console.error('Failed to fetch placement stats:', error)
      throw error
    }
  },

  // Get recent news
  async getRecentNews(limit = 10) {
    try {
      const response = await apiService.placement.getNews({
        limit,
        sort: '-createdAt'
      })
      return response.data.news
    } catch (error) {
      console.error('Failed to fetch recent news:', error)
      throw error
    }
  },

  // Search placement news
  async searchNews(query, filters = {}) {
    try {
      const response = await apiService.placement.getNews({
        search: query,
        ...filters
      })
      return response.data
    } catch (error) {
      console.error('Failed to search news:', error)
      throw error
    }
  },

  // Get news by category
  async getNewsByCategory(category) {
    try {
      const response = await apiService.placement.getNews({
        category
      })
      return response.data.news
    } catch (error) {
      console.error('Failed to fetch news by category:', error)
      throw error
    }
  },

  // Get news by company
  async getNewsByCompany(company) {
    try {
      const response = await apiService.placement.getNews({
        company
      })
      return response.data.news
    } catch (error) {
      console.error('Failed to fetch news by company:', error)
      throw error
    }
  }
}