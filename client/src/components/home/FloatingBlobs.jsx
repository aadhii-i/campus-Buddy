import React from 'react'

const FloatingBlobs = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand-500 rounded-full mix-blend-screen filter blur-3xl opacity-[0.15] animate-blob"></div>
      <div className="absolute -bottom-24 right-0 w-80 h-80 bg-glow-500 rounded-full mix-blend-screen filter blur-3xl opacity-[0.12] animate-blob animation-delay-4000"></div>
    </div>
  )
}

export default FloatingBlobs
