const mongoose = require('mongoose')

const lostItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Item title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Item category is required'],
    enum: [
      'electronics',
      'clothing',
      'accessories',
      'books',
      'documents',
      'sports_equipment',
      'bags',
      'jewelry',
      'keys',
      'other'
    ]
  },
  type: {
    type: String,
    required: [true, 'Item type is required'],
    enum: ['lost', 'found']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  lastSeen: {
    type: Date,
    required: [true, 'Last seen date is required'],
    validate: {
      validator: function(value) {
        return value <= new Date()
      },
      message: 'Last seen date cannot be in the future'
    }
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter is required']
  },
  contact: {
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number']
    },
    preferredMethod: {
      type: String,
      enum: ['email', 'phone', 'both'],
      default: 'email'
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  characteristics: {
    color: String,
    brand: String,
    model: String,
    size: String,
    distinguishingFeatures: [String]
  },
  status: {
    type: String,
    enum: ['active', 'matched', 'resolved', 'expired'],
    default: 'active'
  },
  matches: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LostItem'
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100
    },
    matchedAt: {
      type: Date,
      default: Date.now
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolutionNotes: String,
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    contacts: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    verificationMethod: {
      type: String,
      enum: ['admin', 'photo', 'description', 'meeting']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for checking if item is recently posted
lostItemSchema.virtual('isRecent').get(function() {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  return this.createdAt > threeDaysAgo
})

// Virtual for checking if item is old
lostItemSchema.virtual('isOld').get(function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  return this.createdAt < thirtyDaysAgo
})

// Virtual for getting match count
lostItemSchema.virtual('matchCount').get(function() {
  return this.matches.length
})

// Indexes
lostItemSchema.index({ type: 1 })
lostItemSchema.index({ category: 1 })
lostItemSchema.index({ status: 1 })
lostItemSchema.index({ location: 1 })
lostItemSchema.index({ lastSeen: -1 })
lostItemSchema.index({ reportedBy: 1 })
lostItemSchema.index({ createdAt: -1 })
lostItemSchema.index({ tags: 1 })
lostItemSchema.index({ title: 'text', description: 'text' })
lostItemSchema.index({ 'characteristics.color': 1 })
lostItemSchema.index({ 'characteristics.brand': 1 })

// Pre-save middleware
lostItemSchema.pre('save', function(next) {
  // Auto-resolve if matched and verified
  if (this.matches.some(match => match.isVerified) && !this.isResolved) {
    this.isResolved = true
    this.resolvedAt = new Date()
    this.status = 'resolved'
  }
  
  // Auto-expire old items
  if (this.isOld && this.status === 'active') {
    this.status = 'expired'
  }
  
  next()
})

// Instance method to add comment
lostItemSchema.methods.addComment = async function(userId, text, isPrivate = false) {
  this.comments.push({
    user: userId,
    text,
    isPrivate
  })
  return this.save()
}

// Instance method to mark as resolved
lostItemSchema.methods.markAsResolved = async function(resolvedBy, notes) {
  this.isResolved = true
  this.resolvedAt = new Date()
  this.resolvedBy = resolvedBy
  this.resolutionNotes = notes
  this.status = 'resolved'
  return this.save()
}

// Instance method to add match
lostItemSchema.methods.addMatch = async function(itemId, matchScore) {
  // Check if match already exists
  const existingMatch = this.matches.find(
    match => match.item.toString() === itemId.toString()
  )
  
  if (!existingMatch) {
    this.matches.push({
      item: itemId,
      matchScore
    })
    return this.save()
  }
  
  return this
}

// Static method to find potential matches
lostItemSchema.statics.findMatches = async function(item) {
  const oppositeType = item.type === 'lost' ? 'found' : 'lost'
  
  const query = {
    type: oppositeType,
    category: item.category,
    status: 'active',
    _id: { $ne: item._id }
  }
  
  // Add location proximity (simple string matching for now)
  if (item.location) {
    query.$or = [
      { location: { $regex: item.location, $options: 'i' } },
      { location: { $regex: new RegExp(item.location.split(' ').join('|'), 'i') } }
    ]
  }
  
  const matches = await this.find(query)
    .populate('reportedBy', 'name email')
    .sort({ createdAt: -1 })
  
  return matches
}

// Static method to get recent items
lostItemSchema.statics.getRecent = function(limit = 10, type = null) {
  const query = { status: 'active' }
  if (type) query.type = type
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('reportedBy', 'name department')
}

// Static method to search items
lostItemSchema.statics.search = function(searchQuery, filters = {}) {
  const query = {
    $text: { $search: searchQuery },
    status: 'active',
    ...filters
  }
  
  return this.find(query)
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .populate('reportedBy', 'name department')
}

// Static method to get statistics
lostItemSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        lostItems: {
          $sum: { $cond: [{ $eq: ['$type', 'lost'] }, 1, 0] }
        },
        foundItems: {
          $sum: { $cond: [{ $eq: ['$type', 'found'] }, 1, 0] }
        },
        resolvedItems: {
          $sum: { $cond: [{ $eq: ['$isResolved', true] }, 1, 0] }
        },
        activeItems: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        }
      }
    }
  ])
  
  const categoryStats = await this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ])
  
  return {
    ...stats[0],
    categoryBreakdown: categoryStats
  }
}

module.exports = mongoose.model('LostItem', lostItemSchema)