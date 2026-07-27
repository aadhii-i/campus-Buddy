const express = require('express')
const { protect } = require('../middleware/auth')

const router = express.Router()


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

module.exports = router