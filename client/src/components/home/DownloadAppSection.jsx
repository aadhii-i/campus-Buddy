import React from 'react'
import { motion } from 'framer-motion'
import { Apple, PlayCircle, Bell, Calendar, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import FloatingBlobs from './FloatingBlobs'

const PhoneMockup = ({ delay = 0, floatOffset = 12, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay }}
    className={className}
  >
    <motion.div
      animate={{ y: [0, -floatOffset, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
      className="w-48 sm:w-56 aspect-[9/19] rounded-[2.5rem] bg-midnight-950 border-4 border-midnight-700 shadow-float p-2"
    >
      <div className="w-full h-full rounded-[2rem] bg-surface-50 overflow-hidden relative flex flex-col p-4">
        <div className="w-16 h-1.5 bg-midnight-900/20 rounded-full mx-auto mb-6"></div>
        <p className="text-midnight-500 text-xs mb-1">Good morning,</p>
        <p className="text-midnight-900 font-semibold mb-4">Campus Buddy</p>
        <div className="space-y-2">
          <div className="bg-glow-400 border border-midnight-900/10 rounded-xl p-2.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-midnight-900" />
            <span className="text-midnight-900 text-[11px] font-medium">Next class in 20 min</span>
          </div>
          <div className="bg-brand-200 rounded-xl p-2.5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-midnight-900" />
            <span className="text-midnight-900 text-[11px] font-medium">Attendance: 92%</span>
          </div>
          <div className="bg-midnight-900 rounded-xl p-2.5 flex items-center gap-2">
            <Bell className="w-4 h-4 text-glow-400" />
            <span className="text-surface-50 text-[11px] font-medium">3 new club updates</span>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
)

const DownloadAppSection = () => {
  return (
    <section className="relative py-24 bg-midnight-900 overflow-hidden">
      <FloatingBlobs />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <span className="eyebrow-dark mb-4">
            Take It With You
          </span>
          <h2 className="text-4xl font-bold text-surface-50 mb-4">Campus Buddy, Now in Your Pocket</h2>
          <p className="text-xl text-surface-50/70 mb-8 max-w-lg mx-auto lg:mx-0">
            Get instant timetable alerts, attendance updates, and club notifications — download the app today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => toast('App Store link coming soon!', { icon: '🍎' })}
              className="inline-flex items-center justify-center gap-3 bg-surface-50 text-midnight-900 border border-surface-50 px-6 py-3.5 rounded-2xl font-semibold hover:bg-glow-400 hover:border-glow-400 transition-colors duration-300"
            >
              <Apple className="w-6 h-6" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-normal">Download on the</span>
                <span className="block text-sm">App Store</span>
              </span>
            </button>
            <button
              onClick={() => toast('Google Play link coming soon!', { icon: '▶️' })}
              className="inline-flex items-center justify-center gap-3 bg-surface-50 text-midnight-900 border border-surface-50 px-6 py-3.5 rounded-2xl font-semibold hover:bg-glow-400 hover:border-glow-400 transition-colors duration-300"
            >
              <PlayCircle className="w-6 h-6" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-normal">Get it on</span>
                <span className="block text-sm">Google Play</span>
              </span>
            </button>
          </div>
        </motion.div>

        <div className="flex justify-center items-end gap-6">
          <PhoneMockup delay={0.1} floatOffset={10} className="hidden sm:block mb-8" />
          <PhoneMockup delay={0.3} floatOffset={14} />
        </div>
      </div>
    </section>
  )
}

export default DownloadAppSection
