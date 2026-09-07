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
    // The browser gets the safe `error.message`; the Render log gets the REAL
    // upstream cause (bad Gemini key, model 404, AI timeout, PDF error, ...) so
    // a failure is diagnosable without turning everything into a generic string.
    console.error(
      `[RESUME][${requestId}] AI failure status=${error.status} kind=${error.kind} detail=${JSON.stringify(error.detail) || '(none)'}`
    )
    return res.status(error.status).json({
      success: false,
      code: error.kind,
      requestId,
      message: error.message
    })
  }
  console.error(`[RESUME][${requestId}] Unexpected error:`, error)
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

// @desc    Deep check: confirm the AI service can actually reach the configured
//          Gemini model (a real 1-token generateContent). Use this BEFORE
//          debugging a failing analysis — it isolates "Gemini key/model/quota"
//          from everything else. Slower than /ai-health (makes an LLM call).
// @route   GET /api/resume/gemini-health
// @access  Public
router.get('/gemini-health', async (req, res) => {
  const requestId = newRequestId()
  try {
    const data = await callAiService('/gemini/health', { method: 'GET', requestId })
    res.json({ success: true, aiServiceUrl: AI_BASE_URL, gemini: data })
  } catch (error) {
    sendAiError(res, requestId, error, 'Gemini health check failed.')
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
      `[RESUME][${requestId}] analyze received: user=${req.user?.id} role="${targetRole}" session=${sessionId}`
    )
    console.log(`[RESUME][${requestId}] calling AI service /analyze`)

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

    console.log(
      `[RESUME][${requestId}] analysis returned to frontend: overall=${data.analysis.overallScore} ats=${data.analysis.atsScore}`
    )
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

    // index === 'false' -> AI service just saves + text-checks the PDF (cheap,
    // no torch). The Resume Analyzer sends this: /analyze re-parses the PDF
    // itself and never needs the FAISS chat index, and eagerly building that
    // index OOM-kills a small AI dyno and takes the whole analyze flow down
    // with it. Chat still works — /chat builds the index on demand.
    const wantIndex = req.body.index === undefined ? 'true' : String(req.body.index)

    console.log(
      `[RESUME][${requestId}] upload received: user=${req.user?.id} file="${req.file.originalname}" ${req.file.size}B index=${wantIndex}`
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
    formData.append('index', wantIndex)

    console.log(`[RESUME][${requestId}] calling AI service /upload`)
    const data = await callAiService('/upload', { formData, requestId })
    console.log(
      `[RESUME][${requestId}] upload done: session=${data.sessionId} chunks=${data.chunksIndexed} chatReady=${data.chatReady}`
    )

    res.json({
      success: true,
      requestId,
      sessionId: data.sessionId,
      chunksIndexed: data.chunksIndexed,
      chatReady: data.chatReady
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

    console.log(`[RESUME][${requestId}] chat question: user=${req.user?.id} session=${sessionId} len=${question.length}`)
    const data = await callAiService('/chat', {
      json: { session_id: sessionId, question },
      requestId
    })
    console.log(`[RESUME][${requestId}] chat answer returned: chars=${(data.answer || '').length}`)

    res.json({ success: true, requestId, answer: data.answer })
  } catch (error) {
    sendAiError(res, requestId, error, 'Failed to get an answer from the AI assistant.')
  }
})

module.exports = router
