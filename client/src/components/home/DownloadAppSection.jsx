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
      className="w-48 sm:w-56 aspect-[9/19] rounded-[2.5rem] bg-gray-900 border-4 border-gray-800 shadow-2xl p-2"
    >
      <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 overflow-hidden relative flex flex-col p-4">
        <div className="w-16 h-1.5 bg-black/30 rounded-full mx-auto mb-6"></div>
        <p className="text-white/70 text-xs mb-1">Good morning,</p>
        <p className="text-white font-semibold mb-4">Campus Buddy</p>
        <div className="space-y-2">
          <div className="bg-white/15 rounded-xl p-2.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-white text-[11px]">Next class in 20 min</span>
          </div>
          <div className="bg-white/15 rounded-xl p-2.5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-white text-[11px]">Attendance: 92%</span>
          </div>
          <div className="bg-white/15 rounded-xl p-2.5 flex items-center gap-2">
            <Bell className="w-4 h-4 text-white" />
            <span className="text-white text-[11px]">3 new club updates</span>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
)

const DownloadAppSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden">
      <FloatingBlobs />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <span className="inline-block text-sm font-semibold tracking-wide uppercase text-yellow-300 mb-3">
            Take It With You
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">Campus Buddy, Now in Your Pocket</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-lg mx-auto lg:mx-0">
            Get instant timetable alerts, attendance updates, and club notifications — download the app today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => toast('App Store link coming soon!', { icon: '🍎' })}
              className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3.5 rounded-2xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              <Apple className="w-6 h-6" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-normal">Download on the</span>
                <span className="block text-sm">App Store</span>
              </span>
            </button>
            <button
              onClick={() => toast('Google Play link coming soon!', { icon: '▶️' })}
              className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3.5 rounded-2xl font-semibold hover:bg-gray-100 transition-colors duration-300"
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
