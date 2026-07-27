const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: [
      'academic',
      'cultural',
      'sports',
      'technical',
      'workshop',
      'seminar',
      'competition',
      'social',
      'career',
      'other'
    ]
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value > new Date()
      },
      message: 'Event date must be in the future'
    }
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > this.date
      },
      message: 'End date must be after start date'
    }
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  venue: {
    building: String,
    room: String,
    floor: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Event organizer is required']
  },
  coOrganizers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxAttendees: {
    type: Number,
    min: [1, 'Maximum attendees must be at least 1'],
    max: [10000, 'Maximum attendees cannot exceed 10000']
  },
  currentAttendees: {
    type: Number,
    default: 0,
    min: 0
  },
  registrations: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      submittedAt: Date
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  requirements: {
    isRegistrationRequired: {
      type: Boolean,
      default: true
    },
    isApprovalRequired: {
      type: Boolean,
      default: false
    },
    eligibility: {
      department: [String],
      year: [Number],
      minGPA: Number
    }
  },
  contact: {
    email: {
      type: String,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    phone: String,
    website: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'department'],
    default: 'public'
  },
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: function() {
        return this.recurring.isRecurring
      }
    },
    endDate: Date
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  notifications: {
    reminderSent: {
      type: Boolean,
      default: false
    },
    followUpSent: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
  return this.maxAttendees && this.currentAttendees >= this.maxAttendees
})

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date()
})

// Virtual for checking if event is today
eventSchema.virtual('isToday').get(function() {
  const today = new Date()
  const eventDate = new Date(this.date)
  return eventDate.toDateString() === today.toDateString()
})

// Virtual for getting attendee count
eventSchema.virtual('attendeeCount').get(function() {
  return this.registrations.filter(reg => reg.status === 'registered').length
})

// Indexes
eventSchema.index({ date: 1 })
eventSchema.index({ category: 1 })
eventSchema.index({ organizer: 1 })
eventSchema.index({ status: 1 })
eventSchema.index({ visibility: 1 })
eventSchema.index({ 'venue.coordinates': '2dsphere' })
eventSchema.index({ tags: 1 })
eventSchema.index({ title: 'text', description: 'text' })

// Pre-save middleware
eventSchema.pre('save', function(next) {
  // Update current attendees count
  this.currentAttendees = this.registrations.filter(reg => reg.status === 'registered').length
  
  // Ensure only one primary image
  if (this.images && this.images.length > 0) {
    let primaryCount = 0
    this.images.forEach((img, index) => {
      if (img.isPrimary) {
        primaryCount++
        if (primaryCount > 1) {
          this.images[index].isPrimary = false
        }
      }
    })
    
    // If no primary image, make the first one primary
    if (primaryCount === 0) {
      this.images[0].isPrimary = true
    }
  }
  
  next()
})

// Instance method to register user for event
eventSchema.methods.registerUser = async function(userId) {
  // Check if already registered
  const existingRegistration = this.registrations.find(
    reg => reg.user.toString() === userId.toString()
  )
  
  if (existingRegistration) {
    throw new Error('User is already registered for this event')
  }
  
  // Check if event is full
  if (this.isFull) {
    throw new Error('Event is full')
  }
  
  // Check if event is in the future
  if (!this.isUpcoming) {
    throw new Error('Cannot register for past events')
  }
  
  this.registrations.push({ user: userId })
  return this.save()
}

// Instance method to unregister user from event
eventSchema.methods.unregisterUser = async function(userId) {
  const registrationIndex = this.registrations.findIndex(
    reg => reg.user.toString() === userId.toString()
  )
  
  if (registrationIndex === -1) {
    throw new Error('User is not registered for this event')
  }
  
  this.registrations.splice(registrationIndex, 1)
  return this.save()
}

// Static method to get upcoming events
eventSchema.statics.getUpcoming = function(limit = 10) {
  return this.find({
    date: { $gt: new Date() },
    status: 'published',
    visibility: 'public'
  })
  .sort({ date: 1 })
  .limit(limit)
  .populate('organizer', 'name department')
}

// Static method to get events by category
eventSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({
    category,
    status: 'published',
    visibility: 'public'
  })
  .sort({ date: 1 })
  .limit(limit)
  .populate('organizer', 'name department')
}

// Static method to search events
eventSchema.statics.search = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    status: 'published',
    visibility: 'public',
    ...filters
  }
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' }, date: 1 })
    .populate('organizer', 'name department')
}

module.exports = mongoose.model('Event', eventSchema)