import React from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { studentSuccess } from '../../data/studentSuccess'
import SectionHeading from './SectionHeading'

const StudentSuccessSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Celebrating Excellence"
          title="Student Success Stories"
          subtitle="Real wins from real students across hackathons, internships, research, sports, and clubs."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentSuccess.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${story.color}`}></div>
              <div className="relative z-10">
                <Trophy className="w-8 h-8 text-white/80 mb-4" />
                <span className="text-xs font-semibold uppercase tracking-wide text-white/70">{story.category}</span>
                <h3 className="text-lg font-bold mt-1 mb-2">{story.name}</h3>
                <p className="text-white/90 text-sm leading-relaxed">{story.achievement}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StudentSuccessSection
