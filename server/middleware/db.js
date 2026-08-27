const mongoose = require('mongoose')

// Mongoose is configured with bufferCommands: false (server/app.js), so a
// query issued before the connection is established throws a raw internal
// "Cannot call `x.findOne()` before initial connection is complete" error
// instead of queueing. Left unguarded, that error reaches auth route
// catch blocks and gets reported as a 401 "invalid credentials" — actively
// misleading, since the real problem is infrastructure (missing/wrong
// MONGODB_URI, Atlas unreachable), not the user's password. Checking
// readyState up front turns that into an honest 503.
const requireDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Please try again in a moment.'
    })
  }
  next()
}

module.exports = requireDbConnection
