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
        <span className={`inline-block text-sm font-semibold tracking-wide uppercase mb-3 ${light ? 'text-yellow-300' : 'text-blue-600'}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-xl max-w-3xl mx-auto ${light ? 'text-blue-100' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

export default SectionHeading
