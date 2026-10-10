import React from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { studentSuccess } from '../../data/studentSuccess'
import SectionHeading from './SectionHeading'

// Cards cycle through palette surfaces; legacy `story.color` gradients in the
// data file are no longer used for styling.
const CARD_STYLES = [
  { card: 'bg-midnight-900 text-surface-50 border-midnight-900', icon: 'text-glow-400', meta: 'text-brand-200', body: 'text-surface-50/80' },
  { card: 'bg-brand-200 text-midnight-900 border-midnight-900/10', icon: 'text-midnight-900', meta: 'text-midnight-600', body: 'text-midnight-700' },
  { card: 'bg-glow-400 text-midnight-900 border-midnight-900/10', icon: 'text-midnight-900', meta: 'text-midnight-600', body: 'text-midnight-700' },
]

const StudentSuccessSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Celebrating Excellence"
          title="Student Success Stories"
          subtitle="Real wins from real students across hackathons, internships, research, sports, and clubs."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentSuccess.map((story, index) => {
            const style = CARD_STYLES[index % CARD_STYLES.length]
            return (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className={`relative overflow-hidden rounded-2xl border p-6 ${style.card}`}
            >
              <div className="relative z-10">
                <Trophy className={`w-8 h-8 mb-4 ${style.icon}`} />
                <span className={`text-xs font-semibold uppercase tracking-wide ${style.meta}`}>{story.category}</span>
                <h3 className="text-lg font-bold mt-1 mb-2">{story.name}</h3>
                <p className={`text-sm leading-relaxed ${style.body}`}>{story.achievement}</p>
              </div>
            </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default StudentSuccessSection
