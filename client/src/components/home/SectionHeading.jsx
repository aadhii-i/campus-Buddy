import React from 'react'
import { motion } from 'framer-motion'

const SectionHeading = ({ eyebrow, title, subtitle, light = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      {eyebrow && (
        <span className={`${light ? 'eyebrow-dark' : 'eyebrow'} mb-4`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`text-display text-3xl sm:text-4xl mb-4 ${light ? 'text-surface-50' : 'text-midnight-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-3xl mx-auto ${light ? 'text-surface-50/65' : 'text-midnight-600'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

export default SectionHeading
