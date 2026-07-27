import { apiService } from './api'
import toast from 'react-hot-toast'

export const resumeService = {
  // Analyze resume
  async analyzeResume(resumeFile, onUploadProgress) {
    try {
      if (!resumeFile) {
        throw new Error('Please select a resume file')
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(resumeFile.type)) {
        throw new Error('Please upload a PDF or Word document')
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (resumeFile.size > maxSize) {
        throw new Error('File size must be less than 5MB')
      }

      const formData = new FormData()
      formData.append('resume', resumeFile)

      const response = await apiService.uploadFile('/resume/analyze', formData, onUploadProgress)
      toast.success('Resume analyzed successfully!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to analyze resume'
      toast.error(message)
      throw error
    }
  },

  // Get analysis by ID
  async getAnalysisById(id) {
    try {
      const response = await apiService.resume.getAnalysis(id)
      return response.data.analysis
    } catch (error) {
      console.error('Failed to fetch analysis:', error)
      throw error
    }
  },

  // Get recommendations for analysis
  async getRecommendations(id) {
    try {
      const response = await apiService.resume.getRecommendations(id)
      return response.data.recommendations
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
      throw error
    }
  },

  // Get user's analyses
  async getUserAnalyses() {
    try {
      const response = await apiService.resume.getUserAnalyses()
      return response.data.analyses
    } catch (error) {
      console.error('Failed to fetch user analyses:', error)
      throw error
    }
  },

  // Download analysis report
  async downloadReport(id, format = 'pdf') {
    try {
      const response = await apiService.get(`/resume/analysis/${id}/download`, {
        params: { format },
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `resume-analysis-${id}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Report downloaded successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to download report'
      toast.error(message)
      throw error
    }
  },

  // Share analysis
  async shareAnalysis(id, email) {
    try {
      const response = await apiService.post(`/resume/analysis/${id}/share`, { email })
      toast.success('Analysis shared successfully!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to share analysis'
      toast.error(message)
      throw error
    }
  },

  // Get analysis statistics
  async getAnalysisStats() {
    try {
      const response = await apiService.get('/resume/stats')
      return response.data.stats
    } catch (error) {
      console.error('Failed to fetch analysis stats:', error)
      throw error
    }
  },

  // Get skill recommendations
  async getSkillRecommendations(skills = []) {
    try {
      const response = await apiService.post('/resume/skill-recommendations', { skills })
      return response.data.recommendations
    } catch (error) {
      console.error('Failed to fetch skill recommendations:', error)
      throw error
    }
  },

  // Get job match score
  async getJobMatchScore(analysisId, jobDescription) {
    try {
      const response = await apiService.post(`/resume/analysis/${analysisId}/job-match`, {
        jobDescription
      })
      return response.data
    } catch (error) {
      console.error('Failed to calculate job match score:', error)
      throw error
    }
  }
}