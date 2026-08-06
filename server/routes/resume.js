const express = require('express')
const multer = require('multer')
const { protect } = require('../middleware/auth')

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB, matches the client-side check
})

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'


// @desc    Analyze resume
// @route   POST /api/resume/analyze
// @access  Private
router.post('/analyze', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Resume analysis endpoint working'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Get resume analysis
// @route   GET /api/resume/analysis/:id
// @access  Private
router.get('/analysis/:id', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Get resume analysis endpoint working'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Get recommendations for an analysis
// @route   GET /api/resume/recommendations/:id
// @access  Private
router.get('/recommendations/:id', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      recommendations: []
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Get current user's resume analyses
// @route   GET /api/resume/user-analyses
// @access  Private
router.get('/user-analyses', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      analyses: []
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Upload a resume PDF to the AI service so it can be indexed for chat
// @route   POST /api/resume/chat/upload
// @access  Private
router.post('/chat/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file provided'
      })
    }

    const formData = new FormData()
    formData.append('file', new Blob([req.file.buffer], { type: req.file.mimetype }), req.file.originalname)
    if (req.body.sessionId) {
      formData.append('session_id', req.body.sessionId)
    }

    const aiResponse = await fetch(`${AI_SERVICE_URL}/upload`, {
      method: 'POST',
      body: formData
    })

    const data = await aiResponse.json()

    if (!aiResponse.ok) {
      return res.status(aiResponse.status).json({
        success: false,
        message: data.detail || 'Failed to index resume'
      })
    }

    res.json({
      success: true,
      sessionId: data.sessionId,
      chunksIndexed: data.chunksIndexed
    })
  } catch (error) {
    console.error('Resume chat upload error:', error)
    res.status(502).json({
      success: false,
      message: 'AI service is unavailable. Please try again later.'
    })
  }
})

// @desc    Ask the AI assistant a question about the uploaded resume
// @route   POST /api/resume/chat
// @access  Private
router.post('/chat', protect, async (req, res) => {
  try {
    const { sessionId, question } = req.body

    if (!sessionId || !question) {
      return res.status(400).json({
        success: false,
        message: 'sessionId and question are required'
      })
    }

    const aiResponse = await fetch(`${AI_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, question })
    })

    const data = await aiResponse.json()

    if (!aiResponse.ok) {
      return res.status(aiResponse.status).json({
        success: false,
        message: data.detail || 'Failed to get an answer'
      })
    }

    res.json({
      success: true,
      answer: data.answer
    })
  } catch (error) {
    console.error('Resume chat error:', error)
    res.status(502).json({
      success: false,
      message: 'AI service is unavailable. Please try again later.'
    })
  }
})

module.exports = router