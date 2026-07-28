import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react'
import { attendance } from '../../data/attendance'
import SectionHeading from './SectionHeading'
import CircularProgress from './CircularProgress'

const SAFE_THRESHOLD = 75

const AttendanceCard = ({ subject, index }) => {
  const percentage = Math.round((subject.attended / subject.total) * 100)
  const missed = subject.total - subject.attended
  const projectedTotal = subject.total + 4
  const projected = Math.round((subject.attended / projectedTotal) * 100)

  // Max classes that can still be skipped while staying at/above the safe threshold
  const safeLeaves = Math.max(
    0,
    Math.floor((subject.attended * 100) / SAFE_THRESHOLD - subject.total)
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
    >
      <CircularProgress percentage={percentage} color={subject.color}>
        <div>
          <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
        </div>
      </CircularProgress>

      <h3 className="font-semibold text-gray-900 mt-4">{subject.subject}</h3>

      <div className="w-full mt-4 space-y-2 text-sm text-left">
        <div className="flex items-center justify-between text-gray-500">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Classes Attended</span>
          <span className="font-medium text-gray-800">{subject.attended}/{subject.total}</span>
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <span className="flex items-center gap-1.5"><XCircle className="w-4 h-4 text-red-400" /> Classes Missed</span>
          <span className="font-medium text-gray-800">{missed}</span>
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <span>Projected Attendance</span>
          <span className="font-medium text-gray-800">{projected}%</span>
        </div>
        <div className="flex items-center justify-between text-gray-500 pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-500" /> Safe Leaves Left</span>
          <span className="font-semibold text-blue-600">{safeLeaves}</span>
        </div>
      </div>
    </motion.div>
  )
}

const AttendanceSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Track Your Progress"
          title="Attendance Tracker"
          subtitle="Stay on top of your attendance percentage and know exactly how many classes you can safely miss."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {attendance.map((subject, index) => (
            <AttendanceCard key={subject.subject} subject={subject} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AttendanceSection
