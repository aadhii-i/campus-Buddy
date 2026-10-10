import React from 'react'

// Formerly animated colour blobs; now a quiet dot-grid texture so dark
// sections keep some depth without off-palette gradients.
const FloatingBlobs = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0 bg-dots-dark mask-fade-b"></div>
    </div>
  )
}

export default FloatingBlobs
