const express = require('express')
const { protect } = require('../middleware/auth')

const router = express.Router()

// @desc    Get all lost & found items
// @route   GET /api/lost-found
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Mock lost & found items data
    const mockItems = [
      {
        _id: '1',
        title: 'Lost iPhone 13',
        description: 'Blue iPhone 13 with a clear case, lost near the library',
        category: 'electronics',
        type: 'lost',
        location: 'Library - 2nd floor',
        contactInfo: 'john@example.com',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        user: { name: 'John Doe' }
      },
      {
        _id: '2',
        title: 'Found Wallet',
        description: 'Brown leather wallet with some cards, found near main gate',
        category: 'personal',
        type: 'found',
        location: 'Main Gate',
        contactInfo: '9876543210',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        user: { name: 'Jane Smith' }
      },
      {
        _id: '3',
        title: 'Lost Textbook',
        description: 'Data Structures and Algorithms textbook by Cormen',
        category: 'books',
        type: 'lost',
        location: 'Computer Lab',
        contactInfo: 'alice@example.com',
        createdAt: new Date().toISOString(),
        user: { name: 'Alice Johnson' }
      }
    ];

    // Apply sorting if requested
    let items = [...mockItems];
    if (req.query.sort === '-createdAt') {
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Apply limit if provided
    if (req.query.limit) {
      const limit = parseInt(req.query.limit);
      items = items.slice(0, limit);
    }

    // Set proper headers to prevent caching issues
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Lost & Found API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
})

// @desc    Report new lost/found item
// @route   POST /api/lost-found
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Report item endpoint working'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Get single lost & found item
// @route   GET /api/lost-found/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    res.json({
      success: true,
      item: {
        _id: req.params.id,
        title: 'Sample item',
        description: 'Item details endpoint working',
        category: 'other',
        type: 'lost',
        location: 'Unknown',
        contactInfo: '',
        createdAt: new Date().toISOString(),
        user: { name: 'Unknown' }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Update lost & found item
// @route   PUT /api/lost-found/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Update item endpoint working',
      item: { _id: req.params.id, ...req.body }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Delete lost & found item
// @route   DELETE /api/lost-found/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Item deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Mark item as found
// @route   PATCH /api/lost-found/:id/found
// @access  Private
router.patch('/:id/found', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Item marked as found',
      item: { _id: req.params.id, type: 'found' }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Add comment to item
// @route   POST /api/lost-found/:id/comments
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      comment: {
        _id: Date.now().toString(),
        text: req.body.comment,
        user: { name: req.user.name },
        createdAt: new Date().toISOString()
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

module.exports = router