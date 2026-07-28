const mongoose = require('mongoose')

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Club slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  logoIcon: {
    type: String,
    default: 'Users'
  },
  logoColor: {
    type: String,
    default: 'from-blue-500 to-purple-600'
  },
  description: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  about: {
    type: String,
    default: ''
  },
  vision: {
    type: String,
    default: ''
  },
  activities: [{ type: String, trim: true }],
  gallery: [{
    caption: String
  }],
  membersCount: {
    type: Number,
    default: 0,
    min: 0
  },
  upcomingEvent: {
    title: String,
    date: Date
  },
  facultyCoordinator: {
    name: String,
    designation: String,
    email: String
  },
  coreTeam: [{
    name: String,
    role: String,
    year: String
  }],
  achievements: [{ type: String, trim: true }],
  recruitmentOpen: {
    type: Boolean,
    default: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  recruitmentApplicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
})

clubSchema.index({ slug: 1 })
clubSchema.index({ category: 1 })

module.exports = mongoose.model('Club', clubSchema)
