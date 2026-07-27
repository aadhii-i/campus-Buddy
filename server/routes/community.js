const express = require('express')
const { protect } = require('../middleware/auth')

const router = express.Router()

// @desc    Get all community posts
// @route   GET /api/community
// @access  Public
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Community endpoint working',
      posts: []
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Create new community post
// @route   POST /api/community
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Create post endpoint working'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

module.exports = router