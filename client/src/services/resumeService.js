import { apiService } from './api'
import toast from 'react-hot-toast'

export const resumeService = {
  // Run the real, role-aware AI analysis. Requires the resume to already be
  // indexed via uploadForChat() (or chatUpload directly) so sessionId points
  // at a saved, parseable PDF.
  async analyzeResume(sessionId, targetRole) {
    try {
      const response = await apiService.resume.analyze(sessionId, targetRole)
      return response.data.analysis
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
  },

  // Index the uploaded resume in the RAG AI service so it can be chatted with.
  // Returns a sessionId that scopes every subsequent question to this resume.
  async uploadForChat(resumeFile) {
    const response = await apiService.resume.chatUpload(resumeFile)
    return response.data // { success, sessionId, chunksIndexed }
  },

  // Ask a question about the resume indexed under sessionId
  async askResumeQuestion(sessionId, question) {
    try {
      const response = await apiService.resume.chatAsk(sessionId, question)
      return response.data.answer
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get an answer'
      throw new Error(message)
    }
  }
}