import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, MapPin, User, Download, CalendarDays, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { DAYS, timetable } from '../../data/timetable'
import SectionHeading from './SectionHeading'

// Subject accent colours in data/timetable.js are legacy Tailwind hues; map
// them onto the palette here so the data file stays untouched.
const SLOT_ACCENTS = {
  'bg-blue-500': 'bg-midnight-900',
  'bg-purple-500': 'bg-brand-400',
  'bg-emerald-500': 'bg-glow-500',
  'bg-orange-500': 'bg-brand-200',
  'bg-pink-500': 'bg-brand-600',
  'bg-indigo-500': 'bg-midnight-500',
}

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
    <section className="py-20 sm:py-28 bg-surface-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Stay Organized"
          title="Your Weekly Timetable"
          subtitle="A clean, color-coded view of your classes — inspired by the calendars you already love."
        />

        <div className="surface-panel rounded-3xl p-4 sm:p-8">
          {/* Day tabs */}
          <div className="mb-8 flex justify-center">
          <div className="tab-list max-w-full overflow-x-auto no-scrollbar" role="tablist" aria-label="Day of week">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                role="tab"
                aria-selected={activeDay === day}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  activeDay === day ? 'text-surface-50' : 'text-midnight-500 hover:text-midnight-900'
                }`}
              >
                {activeDay === day && (
                  <motion.div
                    layoutId="active-day-pill"
                    className="absolute inset-0 bg-midnight-900 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {day.slice(0, 3)}
                  {day === todayName && <span className={`ml-1 ${activeDay === day ? 'text-glow-400' : 'text-brand-500'}`} aria-label="today">•</span>}
                </span>
              </button>
            ))}
          </div>
          </div>

          {nextClass && (
            <div className="mb-6 flex justify-center">
            <div className="text-sm text-midnight-900 bg-glow-400 border border-midnight-900/15 rounded-full py-2 px-4 inline-flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Up next: <span className="font-semibold">{nextClass.subject}</span> at {nextClass.time.split(' - ')[0]}
            </div>
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
                <p className="text-center text-midnight-500 py-10 rounded-2xl border border-dashed border-midnight-900/20">No classes scheduled.</p>
              ) : (
                slots.map((slot) => (
                  <div
                    key={`${slot.time}-${slot.subject}`}
                    className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 rounded-2xl p-4 border transition-colors duration-300 ${
                      nextClass === slot
                        ? 'bg-glow-300 border-midnight-900/30'
                        : 'bg-surface-0 border-midnight-900/10 hover:border-midnight-900/30'
                    }`}
                  >
                    <div className={`h-1.5 w-10 sm:h-auto sm:w-1.5 sm:self-stretch rounded-full ${SLOT_ACCENTS[slot.color] || 'bg-midnight-900'}`}></div>
                    <div className="flex items-center gap-2 text-sm font-medium text-midnight-600 sm:w-36 shrink-0">
                      <Clock className="w-4 h-4" /> {slot.time}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-midnight-900">{slot.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-midnight-600">
                      <User className="w-4 h-4" /> {slot.faculty}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-midnight-600">
                      <MapPin className="w-4 h-4" /> {slot.room}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap gap-3 justify-center mt-8 pt-6 border-t border-midnight-900/10">
            <button
              onClick={() => toast('Full timetable view coming soon!', { icon: '🗓️' })}
              className="btn-primary"
            >
              <CalendarDays className="w-4 h-4" /> View Full Timetable
            </button>
            <button
              onClick={downloadTimetable}
              className="btn-ghost"
            >
              <Download className="w-4 h-4" /> Download Timetable
            </button>
            <button
              onClick={() => toast('Calendar sync coming soon!', { icon: '🔄' })}
              className="btn-ghost"
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
