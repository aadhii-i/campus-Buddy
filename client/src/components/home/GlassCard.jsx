import React from 'react'
import { motion } from 'framer-motion'

const GlassCard = ({ children, className = '', onClick, as = 'div', ...props }) => {
  const Component = motion[as] || motion.div

  return (
    <Component
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 hover:border-white/40 transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default GlassCard
