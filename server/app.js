const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss')
const hpp = require('hpp')
const rateLimit = require('express-rate-limit')
require('express-async-errors')
require('dotenv').config()

// Import routes
const authRoutes = require('./routes/auth')
const eventRoutes = require('./routes/events')
const lostFoundRoutes = require('./routes/lostFound')
const communityRoutes = require('./routes/community')
const placementRoutes = require('./routes/placement')
const resumeRoutes = require('./routes/resume')

// Import middleware
const errorHandler = require('./middleware/errorHandler')
const notFound = require('./middleware/notFound')

const app = express()

// Trust proxy (for deployment behind reverse proxy)
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for development
}))

// CORS configuration - production ready
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3002',
      'http://localhost:5173',
      process.env.FRONTEND_URL,
      process.env.CORS_ORIGIN
    ].filter(Boolean)
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
}
app.use(cors(corsOptions))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key])
      }
    })
  }
  next()
})

// Prevent parameter pollution
app.use(hpp())

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/lost-found', lostFoundRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/placement', placementRoutes)
app.use('/api/resume', resumeRoutes)

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path')
  app.use(express.static(path.join(__dirname, '../client/dist')))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })
}

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Database connection with retry logic
const connectDB = async (retries = 5) => {
  console.log('🔍 Attempting MongoDB connection...')
  console.log('🔍 URI:', process.env.MONGODB_URI ? 'Set ✓' : 'Missing ✗')
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_companion', {
      maxPoolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
      serverSelectionTimeoutMS: parseInt(process.env.DB_TIMEOUT) || 30000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    })
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    if (retries > 0) {
      console.log(`🔄 Retrying connection... (${retries} attempts left)`)
      setTimeout(() => connectDB(retries - 1), 5000)
    } else {
      console.error('💥 Failed to connect to MongoDB after multiple attempts')
      process.exit(1)
    }
  }
}

connectDB()

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('📡 MongoDB disconnected')
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Gracefully shutting down...')
  await mongoose.connection.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🔄 Gracefully shutting down...')
  await mongoose.connection.close()
  process.exit(0)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('🚨 Unhandled Promise Rejection:', err.message)
  if (process.env.NODE_ENV === 'production') {
    // Close server & exit process
    process.exit(1)
  }
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err.message)
  console.error(err.stack)
  process.exit(1)
})


const PORT = 3001;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📄 Environment: ${process.env.NODE_ENV}`);
  console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
});

module.exports = app
// restart
