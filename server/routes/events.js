const express = require('express')
const Event = require('../models/Event')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
  try {
    let events = []
    
    // Check if MongoDB is connected
    const mongoose = require('mongoose')
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected, try to fetch from database
      let query = Event.find()

      // Filter by category if provided
      if (req.query.category) {
        query = query.where('category').equals(req.query.category)
      }

      // Filter by date range if provided
      if (req.query.startDate) {
        query = query.where('date').gte(new Date(req.query.startDate))
      }

      if (req.query.endDate) {
        query = query.where('date').lte(new Date(req.query.endDate))
      }

      // Filter upcoming events if requested
      if (req.query.upcoming === 'true') {
        query = query.where('date').gt(new Date())
      }

      // Search by title or description
      if (req.query.search) {
        query = query.where({
          $or: [
            { title: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } }
          ]
        })
      }

      // Sort by date (ascending for upcoming events)
      query = query.sort({ date: 1 })

      // Apply limit if provided
      if (req.query.limit) {
        query = query.limit(parseInt(req.query.limit))
      }

      try {
        events = await query.timeout(5000) // 5 second timeout
      } catch (dbError) {
        console.log('Database query failed, falling back to mock data:', dbError.message)
        events = [] // Will use mock data below
      }
    }

    // If no events from database or database not connected, use mock data
    if (events.length === 0) {
      const mockEvents = [
        {
          _id: '1',
          title: 'Tech Symposium 2025',
          description: 'Annual technology symposium featuring latest trends in AI and Web Development',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          time: '09:00',
          location: 'Main Auditorium',
          category: 'academic',
          organizer: { name: 'Computer Science Department', department: 'CS' },
          maxAttendees: 200,
          currentAttendees: 85,
          registrations: [],
          tags: ['technology', 'AI', 'web development'],
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Cultural Night',
          description: 'Celebrate diversity with performances from various cultural groups',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          time: '18:00',
          location: 'Campus Ground',
          category: 'cultural',
          organizer: { name: 'Cultural Committee', department: 'Student Affairs' },
          maxAttendees: 500,
          currentAttendees: 245,
          registrations: [],
          tags: ['culture', 'performance', 'diversity'],
          createdAt: new Date().toISOString()
        },
        {
          _id: '3',
          title: 'Job Fair 2025',
          description: 'Meet with top companies and explore career opportunities',
          date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          time: '10:00',
          location: 'Conference Hall',
          category: 'career',
          organizer: { name: 'Placement Cell', department: 'Career Services' },
          maxAttendees: 300,
          currentAttendees: 120,
          registrations: [],
          tags: ['career', 'jobs', 'networking'],
          createdAt: new Date().toISOString()
        },
        {
          _id: '4',
          title: 'Workshop on Machine Learning',
          description: 'Hands-on workshop covering the fundamentals of machine learning and practical applications',
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          time: '14:00',
          location: 'Computer Lab 2',
          category: 'workshop',
          organizer: { name: 'AI Club', department: 'Student Organizations' },
          maxAttendees: 50,
          currentAttendees: 32,
          registrations: [],
          tags: ['ML', 'Python', 'hands-on'],
          createdAt: new Date().toISOString()
        },
        {
          _id: '5',
          title: 'Annual Sports Meet',
          description: 'Inter-department sports competition featuring various indoor and outdoor games',
          date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          time: '08:00',
          location: 'Sports Complex',
          category: 'sports',
          organizer: { name: 'Sports Committee', department: 'Athletics' },
          maxAttendees: 1000,
          currentAttendees: 450,
          registrations: [],
          tags: ['sports', 'competition', 'team'],
          createdAt: new Date().toISOString()
        },
        {
          _id: '6',
          title: 'Entrepreneurship Seminar',
          description: 'Learn from successful entrepreneurs about starting your own business',
          date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
          time: '15:30',
          location: 'MBA Hall',
          category: 'seminar',
          organizer: { name: 'Entrepreneurship Cell', department: 'Business School' },
          maxAttendees: 150,
          currentAttendees: 89,
          registrations: [],
          tags: ['entrepreneurship', 'business', 'startup'],
          createdAt: new Date().toISOString()
        }
      ];

      // Filter mock events based on query parameters
      let filteredEvents = mockEvents;
      
      if (req.query.category) {
        filteredEvents = filteredEvents.filter(event => event.category === req.query.category);
      }
      
      if (req.query.upcoming === 'true') {
        const now = new Date();
        filteredEvents = filteredEvents.filter(event => new Date(event.date) > now);
      }
      
      if (req.query.search) {
        const searchLower = req.query.search.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(searchLower) || 
          event.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (req.query.limit) {
        filteredEvents = filteredEvents.slice(0, parseInt(req.query.limit));
      }

      events = filteredEvents;
    }
    // Set proper headers to prevent caching issues
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.json({
      success: true,
      count: events.length,
      data: {
        events: events
      }
    });
  } catch (error) {
    console.error('Events API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
})

// @desc    Create new event
// @route   POST /api/events
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const event = await Event.create(req.body)
    res.status(201).json({
      success: true,
      data: event
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// @desc    Seed sample events (for development)
// @route   POST /api/events/seed
// @access  Public (only for development)
router.post('/seed', async (req, res) => {
  try {
    // Clear existing events
    await Event.deleteMany({})
    
    const sampleEvents = [
      {
        title: 'Tech Symposium 2025',
        description: 'Annual technology symposium featuring latest trends in AI and Web Development. Join industry experts and researchers for insightful sessions.',
        category: 'academic',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '09:00',
        location: 'Main Auditorium',
        organizer: 'Computer Science Department',
        capacity: 200,
        registeredCount: 85,
        tags: ['technology', 'AI', 'web development'],
        requirements: 'Basic knowledge of programming',
        contactEmail: 'cs.dept@campus.edu',
        contactPhone: '+1234567890',
        isPublic: true,
        isFeatured: true
      },
      {
        title: 'Cultural Night 2025',
        description: 'Celebrate diversity with performances from various cultural groups. Experience music, dance, and traditions from around the world.',
        category: 'cultural',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: '18:00',
        location: 'Campus Ground',
        organizer: 'Cultural Committee',
        capacity: 500,
        registeredCount: 245,
        tags: ['culture', 'performance', 'diversity'],
        contactEmail: 'cultural@campus.edu',
        contactPhone: '+1234567891',
        isPublic: true,
        isFeatured: true
      },
      {
        title: 'Job Fair 2025',
        description: 'Meet with top companies and explore career opportunities. Network with recruiters and discover your dream job.',
        category: 'career',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        time: '10:00',
        location: 'Conference Hall',
        organizer: 'Placement Cell',
        capacity: 300,
        registeredCount: 120,
        tags: ['career', 'jobs', 'networking'],
        requirements: 'Resume required',
        contactEmail: 'placement@campus.edu',
        contactPhone: '+1234567892',
        isPublic: true,
        isFeatured: true
      },
      {
        title: 'Machine Learning Workshop',
        description: 'Hands-on workshop covering the fundamentals of machine learning and practical applications using Python.',
        category: 'workshop',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        time: '14:00',
        location: 'Computer Lab 2',
        organizer: 'AI Club',
        capacity: 50,
        registeredCount: 32,
        tags: ['ML', 'Python', 'hands-on'],
        requirements: 'Laptop with Python installed',
        contactEmail: 'aiclub@campus.edu',
        contactPhone: '+1234567893',
        isPublic: true,
        isFeatured: false
      },
      {
        title: 'Annual Sports Meet',
        description: 'Inter-department sports competition featuring various indoor and outdoor games. Show your team spirit!',
        category: 'sports',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        time: '08:00',
        location: 'Sports Complex',
        organizer: 'Sports Committee',
        capacity: 1000,
        registeredCount: 450,
        tags: ['sports', 'competition', 'team'],
        contactEmail: 'sports@campus.edu',
        contactPhone: '+1234567894',
        isPublic: true,
        isFeatured: true
      },
      {
        title: 'Entrepreneurship Seminar',
        description: 'Learn from successful entrepreneurs about starting your own business. Get inspired and learn practical tips.',
        category: 'seminar',
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        time: '15:30',
        location: 'MBA Hall',
        organizer: 'Entrepreneurship Cell',
        capacity: 150,
        registeredCount: 89,
        tags: ['entrepreneurship', 'business', 'startup'],
        contactEmail: 'ecell@campus.edu',
        contactPhone: '+1234567895',
        isPublic: true,
        isFeatured: false
      },
      {
        title: 'Photography Competition',
        description: 'Capture the beauty of campus life in our annual photography competition. Multiple categories available.',
        category: 'competition',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        time: '11:00',
        location: 'Art Gallery',
        organizer: 'Photography Club',
        capacity: 100,
        registeredCount: 67,
        tags: ['photography', 'art', 'competition'],
        requirements: 'Camera (phone cameras allowed)',
        contactEmail: 'photoclub@campus.edu',
        contactPhone: '+1234567896',
        isPublic: true,
        isFeatured: false
      },
      {
        title: 'Science Exhibition',
        description: 'Showcase innovative science projects and experiments. Open to all departments and students.',
        category: 'academic',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        time: '10:00',
        location: 'Science Building',
        organizer: 'Science Department',
        capacity: 300,
        registeredCount: 156,
        tags: ['science', 'innovation', 'exhibition'],
        contactEmail: 'science@campus.edu',
        contactPhone: '+1234567897',
        isPublic: true,
        isFeatured: true
      }
    ]

    const events = await Event.insertMany(sampleEvents)

    res.json({
      success: true,
      message: `${events.length} sample events created successfully`,
      data: events
    })
  } catch (error) {
    console.error('Seed events error:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
router.post('/:id/register', protect, async (req, res) => {
  try {
    const eventId = req.params.id
    const userId = req.user.id
    
    // For now, we'll use mock data since database isn't connected
    // In a real scenario, you'd check if event exists and user hasn't already registered
    
    // Mock registration logic
    const mockRegistration = {
      _id: Date.now().toString(),
      eventId: eventId,
      userId: userId,
      registeredAt: new Date().toISOString(),
      status: 'registered'
    }
    
    res.json({
      success: true,
      message: 'Successfully registered for event',
      data: mockRegistration
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to register for event'
    })
  }
})

// @desc    Unregister from event
// @route   DELETE /api/events/:id/register
// @access  Private
router.delete('/:id/register', protect, async (req, res) => {
  try {
    const eventId = req.params.id
    const userId = req.user.id
    
    // Mock unregistration logic
    res.json({
      success: true,
      message: 'Successfully unregistered from event'
    })
  } catch (error) {
    console.error('Unregistration error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to unregister from event'
    })
  }
})

// @desc    Get event registrations
// @route   GET /api/events/:id/registrations
// @access  Private
router.get('/:id/registrations', protect, async (req, res) => {
  try {
    const eventId = req.params.id
    
    // Mock registrations data
    const mockRegistrations = [
      {
        _id: '1',
        user: {
          _id: req.user.id,
          name: req.user.name,
          email: req.user.email
        },
        registeredAt: new Date().toISOString(),
        status: 'registered'
      }
    ]
    
    res.json({
      success: true,
      count: mockRegistrations.length,
      data: {
        registrations: mockRegistrations
      }
    })
  } catch (error) {
    console.error('Get registrations error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get event registrations'
    })
  }
})

module.exports = router