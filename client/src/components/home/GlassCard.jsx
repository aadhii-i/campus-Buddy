import React from 'react'
import { motion } from 'framer-motion'

// Name kept for compatibility; now a flat paper card with a hairline border
// (no glassmorphism) that lifts slightly on hover.
const GlassCard = ({ children, className = '', onClick, as = 'div', ...props }) => {
  const Component = motion[as] || motion.div

  return (
    <Component
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`group relative rounded-2xl border border-midnight-900/10 bg-surface-0 transition-[box-shadow,border-color] duration-300 hover:border-midnight-900/40 hover:shadow-card-hover ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default GlassCard
