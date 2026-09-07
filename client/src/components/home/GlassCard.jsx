import React from 'react'
import { motion } from 'framer-motion'

const GlassCard = ({ children, className = '', onClick, as = 'div', ...props }) => {
  const Component = motion[as] || motion.div

  return (
    <Component
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group relative bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl shadow-card hover:shadow-glow hover:border-white/20 transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default GlassCard
