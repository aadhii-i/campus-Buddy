import { apiService } from './api'
import toast from 'react-hot-toast'

export const eventService = {
  // Get all events
  async getAllEvents(filters = {}) {
    try {
      const response = await apiService.events.getAll(filters)
      return response.data.data // This returns { events: [...] }
    } catch (error) {
      console.error('Failed to fetch events:', error)
      throw error
    }
  },

  // Get event by ID
  async getEventById(id) {
    try {
      const response = await apiService.events.getById(id)
      return response.data.event
    } catch (error) {
      console.error('Failed to fetch event:', error)
      throw error
    }
  },

  // Create new event
  async createEvent(eventData) {
    try {
      const response = await apiService.events.create(eventData)
      toast.success('Event created successfully!')
      return response.data.event
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create event'
      toast.error(message)
      throw error
    }
  },

  // Update event
  async updateEvent(id, eventData) {
    try {
      const response = await apiService.events.update(id, eventData)
      toast.success('Event updated successfully!')
      return response.data.event
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update event'
      toast.error(message)
      throw error
    }
  },

  // Delete event
  async deleteEvent(id) {
    try {
      await apiService.events.delete(id)
      toast.success('Event deleted successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete event'
      toast.error(message)
      throw error
    }
  },

  // Register for event
  async registerForEvent(id) {
    try {
      const response = await apiService.events.register(id)
      toast.success('Successfully registered for event!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register for event'
      toast.error(message)
      throw error
    }
  },

  // Unregister from event
  async unregisterFromEvent(id) {
    try {
      await apiService.events.unregister(id)
      toast.success('Successfully unregistered from event!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to unregister from event'
      toast.error(message)
      throw error
    }
  },

  // Get event registrations
  async getEventRegistrations(id) {
    try {
      const response = await apiService.events.getRegistrations(id)
      return response.data.registrations
    } catch (error) {
      console.error('Failed to fetch event registrations:', error)
      throw error
    }
  },

  // Get upcoming events
  async getUpcomingEvents(limit = 5) {
    try {
      const response = await apiService.events.getAll({
        upcoming: true,
        limit
      })
      return response.data.data.events
    } catch (error) {
      console.error('Failed to fetch upcoming events:', error)
      throw error
    }
  },

  // Search events
  async searchEvents(query, filters = {}) {
    try {
      const response = await apiService.events.getAll({
        search: query,
        ...filters
      })
      return response.data.data // This returns { events: [...] }
    } catch (error) {
      console.error('Failed to search events:', error)
      throw error
    }
  }
}