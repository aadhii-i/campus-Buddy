import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import {
  Users, Calendar, Mail, Trophy, Target, Sparkles,
  ArrowLeft, UserPlus, ClipboardCheck
} from 'lucide-react'
import toast from 'react-hot-toast'
import { clubService } from '../services/clubService'
import { useAuth } from '../context/AuthContext'
import LogoTile from '../components/home/LogoTile'
import AnimatedCounter from '../components/home/AnimatedCounter'
import { LoadingState } from '../components/common'

const ClubDetails = () => {
  const { slug } = useParams()
  const { isAuthenticated } = useAuth()
  const [club, setClub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    setLoading(true)
    clubService.getClubBySlug(slug).then((data) => {
      setClub(data)
      setLoading(false)
    })
  }, [slug])

  const handleJoin = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to join this club')
      return
    }
    setJoining(true)
    try {
      await clubService.joinClub(club._id)
    } finally {
      setJoining(false)
    }
  }

  const handleRegisterRecruitment = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to register for recruitment')
      return
    }
    setRegistering(true)
    try {
      await clubService.registerRecruitment(club._id)
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 pt-20">
        <LoadingState label="Loading club…" />
      </div>
    )
  }

  if (!club) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-50 px-4 pt-20 text-center">
        <h2 className="text-display mb-2 text-2xl text-midnight-900">Club not found</h2>
        <p className="mb-6 text-midnight-500">The club you're looking for doesn't exist.</p>
        <Link to="/" className="font-semibold text-brand-600 hover:underline">Back to home</Link>
      </div>
    )
  }

  const Icon = Icons[club.logoIcon] || Users

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${club.logoColor}`}>
        <div className="absolute inset-0 bg-black/25" />
        <div className="pointer-events-none absolute inset-0 bg-noise" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-6 sm:flex-row sm:items-center"
          >
            <LogoTile icon={Icon} label={club.name} gradient="from-white/30 to-white/10" size="lg" />
            <div>
              <span className="text-sm font-medium uppercase tracking-wide text-white/80">{club.category}</span>
              <h1 className="text-display mb-3 mt-1 text-4xl text-white sm:text-5xl">{club.name}</h1>
              <p className="max-w-2xl text-lg text-white/90">{club.description}</p>
            </div>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={handleJoin}
              disabled={joining}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-midnight-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50 disabled:opacity-60"
            >
              <UserPlus className="h-4.5 w-4.5" />
              {joining ? 'Joining…' : 'Join club'}
            </button>
            {club.recruitmentOpen && (
              <button
                onClick={handleRegisterRecruitment}
                disabled={registering}
                className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-midnight-900 disabled:opacity-60"
              >
                <ClipboardCheck className="h-4.5 w-4.5" />
                {registering ? 'Registering…' : 'Register for recruitment'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* Main content */}
        <div className="space-y-12 lg:col-span-2">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-midnight-900">
              <Sparkles className="h-5 w-5 text-brand-600" /> About the club
            </h2>
            <p className="leading-relaxed text-midnight-600">{club.about}</p>
          </section>

          {club.vision && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-midnight-900">
                <Target className="h-5 w-5 text-brand-600" /> Vision
              </h2>
              <p className="leading-relaxed text-midnight-600">{club.vision}</p>
            </section>
          )}

          {club.activities?.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold text-midnight-900">Activities</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {club.activities.map((activity) => (
                  <div key={activity} className="rounded-xl border border-midnight-100 bg-white p-4 font-medium text-midnight-700 shadow-soft">
                    {activity}
                  </div>
                ))}
              </div>
            </section>
          )}

          {club.gallery?.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold text-midnight-900">Gallery</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {club.gallery.map((item, i) => (
                  <div
                    key={i}
                    className={`flex aspect-square items-end rounded-xl bg-gradient-to-br ${club.logoColor} p-3 text-sm font-medium text-white shadow-card`}
                  >
                    {item.caption}
                  </div>
                ))}
              </div>
            </section>
          )}

          {club.achievements?.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-midnight-900">
                <Trophy className="h-5 w-5 text-amber-500" /> Achievements
              </h2>
              <ul className="space-y-2.5">
                {club.achievements.map((achievement) => (
                  <li key={achievement} className="flex items-start gap-2.5 text-midnight-600">
                    <Trophy className="mt-1 h-4 w-4 shrink-0 text-amber-500" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="surface-panel p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Users className="h-4.5 w-4.5" />
              </div>
              <span className="text-2xl font-bold text-midnight-900">
                <AnimatedCounter value={club.membersCount} />
              </span>
            </div>
            <p className="text-sm text-midnight-500">Active members</p>
          </div>

          {club.upcomingEvent?.title && (
            <div className="surface-panel p-6">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-midnight-900">
                <Calendar className="h-4.5 w-4.5 text-brand-600" /> Upcoming event
              </h3>
              <p className="font-medium text-midnight-700">{club.upcomingEvent.title}</p>
              <p className="mt-1 text-sm text-midnight-400">
                {new Date(club.upcomingEvent.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </p>
            </div>
          )}

          {club.facultyCoordinator?.name && (
            <div className="surface-panel p-6">
              <h3 className="mb-3 font-semibold text-midnight-900">Faculty coordinator</h3>
              <p className="font-medium text-midnight-700">{club.facultyCoordinator.name}</p>
              <p className="text-sm text-midnight-400">{club.facultyCoordinator.designation}</p>
              {club.facultyCoordinator.email && (
                <a href={`mailto:${club.facultyCoordinator.email}`} className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline">
                  <Mail className="h-3.5 w-3.5" /> {club.facultyCoordinator.email}
                </a>
              )}
            </div>
          )}

          {club.coreTeam?.length > 0 && (
            <div className="surface-panel p-6">
              <h3 className="mb-4 font-semibold text-midnight-900">Core team</h3>
              <div className="space-y-3">
                {club.coreTeam.map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <LogoTile label={member.name} gradient={club.logoColor} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-midnight-900">{member.name}</p>
                      <p className="text-xs text-midnight-400">{member.role} · {member.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClubDetails
