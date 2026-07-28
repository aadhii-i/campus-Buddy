import { apiService } from './api'
import { clubsFallback } from '../data/clubsFallback'
import toast from 'react-hot-toast'

export const clubService = {
  // Get all clubs
  async getAllClubs() {
    try {
      const response = await apiService.get('/clubs', { silent: true })
      return response.data.clubs || []
    } catch (error) {
      console.error('Failed to fetch clubs, using local fallback:', error)
      return clubsFallback
    }
  },

  // Get a single club by slug
  async getClubBySlug(slug) {
    try {
      const response = await apiService.clubs.getBySlug(slug)
      return response.data.club
    } catch (error) {
      console.error('Failed to fetch club, using local fallback:', error)
      return clubsFallback.find((c) => c.slug === slug) || null
    }
  },

  // Join a club
  async joinClub(id) {
    try {
      const response = await apiService.clubs.join(id)
      toast.success('Successfully joined the club!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to join club'
      toast.error(message)
      throw error
    }
  },

  // Register for club recruitment
  async registerRecruitment(id) {
    try {
      const response = await apiService.clubs.registerRecruitment(id)
      toast.success('Registered for recruitment!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register for recruitment'
      toast.error(message)
      throw error
    }
  }
}
