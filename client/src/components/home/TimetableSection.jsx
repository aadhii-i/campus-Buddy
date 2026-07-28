import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, MapPin, User, Download, CalendarDays, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { DAYS, timetable } from '../../data/timetable'
import SectionHeading from './SectionHeading'

const todayName = DAYS[(new Date().getDay() + 6) % 7] || DAYS[0]

const downloadTimetable = () => {
  const lines = DAYS.flatMap((day) => [
    `${day}`,
    ...timetable[day].map((slot) => `  ${slot.time}  ${slot.subject}  (${slot.faculty}, ${slot.room})`),
    ''
  ])
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'campus-buddy-timetable.txt'
  link.click()
  URL.revokeObjectURL(url)
  toast.success('Timetable downloaded!')
}

const TimetableSection = () => {
  const [activeDay, setActiveDay] = useState(DAYS.includes(todayName) ? todayName : DAYS[0])
  const slots = timetable[activeDay] || []

  const nextClass = useMemo(() => {
    if (activeDay !== todayName) return null
    const now = new Date()
    return slots.find((slot) => {
      const [start] = slot.time.split(' - ')
      const [h, m] = start.split(':').map(Number)
      const slotDate = new Date()
      slotDate.setHours(h, m, 0, 0)
      return slotDate > now
    })
  }, [activeDay, slots])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Stay Organized"
          title="Your Weekly Timetable"
          subtitle="A clean, color-coded view of your classes — inspired by the calendars you already love."
        />

        <div className="bg-gray-50 rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-8">
          {/* Day tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  activeDay === day ? 'text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {activeDay === day && (
                  <motion.div
                    layoutId="active-day-pill"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {day.slice(0, 3)}
                  {day === todayName && <span className="ml-1 text-yellow-300">•</span>}
                </span>
              </button>
            ))}
          </div>

          {nextClass && (
            <div className="mb-6 text-center text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-full py-2 px-4 inline-flex items-center gap-2 mx-auto">
              <Clock className="w-4 h-4" />
              Up next: <span className="font-semibold">{nextClass.subject}</span> at {nextClass.time.split(' - ')[0]}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {slots.length === 0 ? (
                <p className="text-center text-gray-400 py-10">No classes scheduled.</p>
              ) : (
                slots.map((slot) => (
                  <div
                    key={`${slot.time}-${slot.subject}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className={`w-2 self-stretch rounded-full ${slot.color} sm:w-1.5`}></div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 sm:w-36 shrink-0">
                      <Clock className="w-4 h-4" /> {slot.time}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{slot.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-4 h-4" /> {slot.faculty}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" /> {slot.room}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button
              onClick={() => toast('Full timetable view coming soon!', { icon: '🗓️' })}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              <CalendarDays className="w-4 h-4" /> View Full Timetable
            </button>
            <button
              onClick={downloadTimetable}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" /> Download Timetable
            </button>
            <button
              onClick={() => toast('Calendar sync coming soon!', { icon: '🔄' })}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Sync Calendar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimetableSection
