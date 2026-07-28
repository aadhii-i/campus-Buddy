import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'

const AnimatedCounter = ({ value, duration = 1.5, suffix = '', prefix = '', className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(0)
  const numericValue = parseFloat(value) || 0

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, numericValue, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(latest)
    })
    return () => controls.stop()
  }, [isInView, numericValue, duration])

  const isInt = Number.isInteger(numericValue)

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      {isInt ? Math.round(display) : display.toFixed(1)}
      {suffix}
    </motion.span>
  )
}

export default AnimatedCounter
