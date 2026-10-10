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
    <section className="relative overflow-hidden border-b border-midnight-900/10 bg-surface-50 pb-20 pt-32 sm:pb-28 sm:pt-40">
      {/* Restrained background: fine dot grid that fades out, no gradients */}
      <div className="pointer-events-none absolute inset-0 bg-dots mask-fade-b" />

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
            className="text-display mt-6 text-[2.6rem] leading-[1.03] text-midnight-900 sm:text-6xl lg:text-[4.4rem]"
          >
            Your campus.
            <br />
            One intelligent
            <br />
            <span className="marker">companion.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mt-6 max-w-md text-lg leading-relaxed text-midnight-600"
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
            className="mt-14 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 border-t border-midnight-900/15 pt-8 sm:grid-cols-4"
          >
            {STATS.map((s, i) => (
              <div key={s.label} className={i > 0 ? 'sm:border-l sm:border-midnight-900/10 sm:pl-6' : ''}>
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
          <div className="absolute inset-x-2 inset-y-6 overflow-hidden rounded-[2rem] bg-midnight-900">
            <div className="absolute inset-0 bg-dots-dark" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full border border-brand-200/20" />
            <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full border border-brand-200/10" />
          </div>

          {/* Resume AI score preview — the hero feature, largest */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-6 top-8 w-56 rounded-2xl border border-midnight-900 bg-glow-400 p-4 text-midnight-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wide2 text-midnight-700">Resume score</span>
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <p className="mt-2 font-display text-4xl font-bold">87</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-midnight-900/15">
              <div className="h-full w-[87%] rounded-full bg-midnight-900" />
            </div>
            <p className="mt-2 text-[11px] font-semibold">Strong ATS match</p>
          </motion.div>

          {/* Event card preview */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute right-4 top-2 flex w-40 items-center gap-2.5 rounded-xl border border-midnight-900/10 bg-surface-0 p-3 shadow-float"
          >
            <div className="icon-tile h-9 w-9 rounded-lg">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-midnight-900">Hack Night</p>
              <p className="text-[11px] text-midnight-500">Fri · 6:00 PM</p>
            </div>
          </motion.div>

          {/* AI chat bubble preview */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute bottom-24 right-0 w-48 rounded-2xl rounded-br-sm border border-midnight-900/10 bg-brand-200 p-3.5 text-midnight-900 shadow-float"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide2 text-midnight-700">
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
            className="absolute bottom-6 left-8 flex items-center gap-2 rounded-full border border-midnight-900/10 bg-surface-0 py-2 pl-2 pr-4 shadow-float"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-midnight-900 text-glow-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-midnight-900">Item reunited</span>
          </motion.div>

          {/* community avatars stack */}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-midnight-900 px-3 py-1.5">
            <Users className="h-3.5 w-3.5 text-brand-200" />
            <span className="text-[11px] font-medium text-surface-50/80">42 in Community</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
