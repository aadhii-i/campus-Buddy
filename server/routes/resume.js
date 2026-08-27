const express = require('express')
const crypto = require('crypto')
const multer = require('multer')
const { protect } = require('../middleware/auth')
const { callAiService, AiServiceError, AI_BASE_URL } = require('../utils/aiService')

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB, matches the client-side check
})

// Short correlation id so a single "Analyze Resume" click can be followed
// across the Express log and (via the same id in messages) the AI service.
const newRequestId = () => crypto.randomBytes(4).toString('hex')

// Turn an AiServiceError (or anything unexpected) into a safe HTTP response.
// Never leak stack traces or internal detail strings to the browser.
const sendAiError = (res, requestId, error, fallbackMessage) => {
  if (error instanceof AiServiceError) {
    return res.status(error.status).json({
      success: false,
      code: error.kind,
      requestId,
      message: error.message
    })
  }
  console.error(`[resume][${requestId}] Unexpected error:`, error)
  return res.status(500).json({
    success: false,
    code: 'express_error',
    requestId,
    message: fallbackMessage
  })
}

// @desc    Lightweight passthrough health check for the AI service.
//          Handy for "is it the frontend, Express, or the AI service?" triage.
// @route   GET /api/resume/ai-health
// @access  Public
router.get('/ai-health', async (req, res) => {
  const requestId = newRequestId()
  try {
    const data = await callAiService('/health', { method: 'GET', requestId })
    res.json({ success: true, aiServiceUrl: AI_BASE_URL, ai: data })
  } catch (error) {
    sendAiError(res, requestId, error, 'AI service health check failed.')
  }
})

// @desc    Run the AI-powered, role-aware resume analysis for an already-indexed
//          resume (call POST /api/resume/chat/upload first to get a sessionId)
// @route   POST /api/resume/analyze
// @access  Private
router.post('/analyze', protect, async (req, res) => {
  const requestId = newRequestId()
  try {
    const { sessionId, targetRole } = req.body

    if (!sessionId || !targetRole) {
      return res.status(400).json({
        success: false,
        code: 'bad_request',
        requestId,
        message: 'sessionId and targetRole are required'
      })
    }

    console.log(
      `[resume][${requestId}] analyze user=${req.user?.id} role="${targetRole}" session=${sessionId}`
    )

    const data = await callAiService('/analyze', {
      json: { session_id: sessionId, target_role: targetRole },
      requestId
    })

    if (!data || !data.analysis) {
      throw new AiServiceError('The AI service returned an empty analysis.', {
        status: 502,
        kind: 'ai_error'
      })
    }

    res.json({ success: true, requestId, analysis: data.analysis })
  } catch (error) {
    sendAiError(res, requestId, error, 'Failed to analyze resume. Please try again.')
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
//          and re-parsed by /analyze
// @route   POST /api/resume/chat/upload
// @access  Private
router.post('/chat/upload', protect, upload.single('resume'), async (req, res) => {
  const requestId = newRequestId()
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        code: 'bad_request',
        requestId,
        message: 'No resume file provided'
      })
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        code: 'bad_request',
        requestId,
        message: 'Only PDF resumes are supported.'
      })
    }

    console.log(
      `[resume][${requestId}] upload user=${req.user?.id} file="${req.file.originalname}" ${req.file.size}B`
    )

    const formData = new FormData()
    formData.append(
      'file',
      new Blob([req.file.buffer], { type: req.file.mimetype }),
      req.file.originalname
    )
    if (req.body.sessionId) {
      formData.append('session_id', req.body.sessionId)
    }

    const data = await callAiService('/upload', { formData, requestId })

    res.json({
      success: true,
      requestId,
      sessionId: data.sessionId,
      chunksIndexed: data.chunksIndexed
    })
  } catch (error) {
    sendAiError(res, requestId, error, 'Failed to process the uploaded resume. Please try again.')
  }
})

// @desc    Ask the AI assistant a question about the uploaded resume
// @route   POST /api/resume/chat
// @access  Private
router.post('/chat', protect, async (req, res) => {
  const requestId = newRequestId()
  try {
    const { sessionId, question } = req.body

    if (!sessionId || !question) {
      return res.status(400).json({
        success: false,
        code: 'bad_request',
        requestId,
        message: 'sessionId and question are required'
      })
    }

    const data = await callAiService('/chat', {
      json: { session_id: sessionId, question },
      requestId
    })

    res.json({ success: true, requestId, answer: data.answer })
  } catch (error) {
    sendAiError(res, requestId, error, 'Failed to get an answer from the AI assistant.')
  }
})

module.exports = router
