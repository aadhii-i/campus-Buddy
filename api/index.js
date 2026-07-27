const express = require('express')
const cors = require('cors')

// Import routes
const eventRoutes = require('../server/routes/events')

const app = express()

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://campus-companion.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true
}))

app.use(express.json())

// Routes
app.use('/api/events', eventRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Campus Companion API is running' })
})

// Export for Vercel
module.exports = app