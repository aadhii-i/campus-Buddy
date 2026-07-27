const express = require('express')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// @desc    Get all placement news
// @route   GET /api/placement
// @access  Public
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Placement endpoint working',
      news: []
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Create placement news
// @route   POST /api/placement
// @access  Private (Admin/Moderator only)
router.post('/', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Create placement news endpoint working'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

module.exports = router