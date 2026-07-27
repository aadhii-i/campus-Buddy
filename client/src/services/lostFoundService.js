import { apiService } from './api'
import toast from 'react-hot-toast'

export const lostFoundService = {
  // Get all lost & found items
  async getAllItems(filters = {}) {
    try {
      const response = await apiService.lostFound.getAll(filters)
      return response.data
    } catch (error) {
      console.error('Failed to fetch lost & found items:', error)
      throw error
    }
  },

  // Get item by ID
  async getItemById(id) {
    try {
      const response = await apiService.lostFound.getById(id)
      return response.data.item
    } catch (error) {
      console.error('Failed to fetch item:', error)
      throw error
    }
  },

  // Create new lost & found item
  async createItem(itemData) {
    try {
      const response = await apiService.lostFound.create(itemData)
      toast.success('Item posted successfully!')
      return response.data.item
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to post item'
      toast.error(message)
      throw error
    }
  },

  // Update item
  async updateItem(id, itemData) {
    try {
      const response = await apiService.lostFound.update(id, itemData)
      toast.success('Item updated successfully!')
      return response.data.item
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update item'
      toast.error(message)
      throw error
    }
  },

  // Delete item
  async deleteItem(id) {
    try {
      await apiService.lostFound.delete(id)
      toast.success('Item deleted successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete item'
      toast.error(message)
      throw error
    }
  },

  // Mark item as found
  async markAsFound(id) {
    try {
      const response = await apiService.lostFound.markAsFound(id)
      toast.success('Item marked as found!')
      return response.data.item
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark item as found'
      toast.error(message)
      throw error
    }
  },

  // Add comment to item
  async addComment(id, comment) {
    try {
      const response = await apiService.lostFound.addComment(id, comment)
      return response.data.comment
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add comment'
      toast.error(message)
      throw error
    }
  },

  // Search items
  async searchItems(query, filters = {}) {
    try {
      const response = await apiService.lostFound.getAll({
        search: query,
        ...filters
      })
      return response.data
    } catch (error) {
      console.error('Failed to search items:', error)
      throw error
    }
  },

  // Get recent items
  async getRecentItems(limit = 10) {
    try {
      const response = await apiService.lostFound.getAll({
        limit,
        sort: '-createdAt'
      })
      return response.data.items
    } catch (error) {
      console.error('Failed to fetch recent items:', error)
      throw error
    }
  },

  // Get user's items
  async getUserItems() {
    try {
      const response = await apiService.lostFound.getAll({
        user: 'me'
      })
      return response.data.items
    } catch (error) {
      console.error('Failed to fetch user items:', error)
      throw error
    }
  }
}