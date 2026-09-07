import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Users, Sparkles, MessageCircle, CheckCircle2, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const STATS = [
  { value: '1,000+', label: 'Active students' },
  { value: '500+', label: 'Events hosted' },
  { value: '200+', label: 'Items reunited' },
  { value: '99%', label: 'Would recommend' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
}

const Hero = ({ user }) => {
  return (
    <section className="relative overflow-hidden bg-surface-50 pb-20 pt-32 sm:pb-28 sm:pt-40">
      {/* Restrained background: one soft mesh gradient + fine grain, no rainbow blobs */}
      <div className="pointer-events-none absolute inset-0 bg-mesh-light" />
      <div className="pointer-events-none absolute inset-0 bg-noise" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-brand-200/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-8">
        {/* Left: statement */}
        <div>
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
            <span className="eyebrow">
              <Sparkles className="h-3 w-3" /> AI-powered campus platform
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-display mt-5 text-[2.6rem] leading-[1.03] text-midnight-900 sm:text-6xl lg:text-[4.1rem]"
          >
            Your campus.
            <br />
            One intelligent
            <br />
            <span className="text-gradient-brand">companion.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-md text-lg leading-relaxed text-midnight-500"
          >
            Campus Buddy brings events, community, lost &amp; found, placements and an
            AI resume coach into one place — so campus life stops living across
            five different group chats.
          </motion.p>

          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/events" className="btn-primary !px-6 !py-3.5 !text-[0.95rem]">
              Explore what's on
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/resume-analyzer" className="btn-ghost !px-6 !py-3.5 !text-[0.95rem]">
              <Sparkles className="h-4 w-4" />
              Try the Resume AI
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={4}
            variants={fadeUp}
            className="mt-14 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 border-t border-midnight-100 pt-8 sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-midnight-900">{s.value}</p>
                <p className="mt-0.5 text-xs text-midnight-500">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: floating ecosystem composition — not identical cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative mx-auto h-[26rem] w-full max-w-md lg:h-[30rem]"
        >
          {/* Base dark panel — the "product" surface everything floats above */}
          <div className="absolute inset-x-2 inset-y-6 rounded-[2rem] bg-midnight-900 shadow-card-hover">
            <div className="absolute inset-0 rounded-[2rem] bg-mesh-dark opacity-90" />
            <div className="absolute inset-0 rounded-[2rem] bg-noise" />
          </div>

          {/* Resume AI score preview — the hero feature, largest */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-6 top-8 w-56 rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wide2 text-white/50">Resume score</span>
              <TrendingUp className="h-3.5 w-3.5 text-glow-400" />
            </div>
            <p className="mt-2 font-display text-4xl font-bold text-white">87</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-brand-400 to-glow-400" />
            </div>
            <p className="mt-2 text-[11px] font-medium text-glow-400">Strong ATS match</p>
          </motion.div>

          {/* Event card preview */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute right-4 top-2 flex w-40 items-center gap-2.5 rounded-xl bg-white p-3 shadow-card"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-midnight-900">Hack Night</p>
              <p className="text-[11px] text-midnight-400">Fri · 6:00 PM</p>
            </div>
          </motion.div>

          {/* AI chat bubble preview */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute bottom-24 right-0 w-48 rounded-2xl rounded-br-sm bg-brand-600 p-3.5 text-white shadow-glow"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide2 text-white/70">
              <MessageCircle className="h-3 w-3" /> AI Assistant
            </div>
            <p className="mt-1.5 text-[13px] leading-snug">
              You're missing 2 keywords for "System Design" — want fixes?
            </p>
          </motion.div>

          {/* Lost & found reunited pill */}
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            className="absolute bottom-6 left-8 flex items-center gap-2 rounded-full bg-white py-2 pl-2 pr-4 shadow-card"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-midnight-800">Item reunited</span>
          </motion.div>

          {/* community avatars stack */}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur-xl">
            <Users className="h-3.5 w-3.5 text-white/70" />
            <span className="text-[11px] font-medium text-white/70">42 in Community</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
