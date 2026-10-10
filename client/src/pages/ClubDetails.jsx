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
      <div className="page-shell flex items-center justify-center">
        <LoadingState label="Loading club…" />
      </div>
    )
  }

  if (!club) {
    return (
      <div className="page-shell flex flex-col items-center justify-center px-4 text-center">
        <div className="surface-panel max-w-md px-8 py-12">
          <div className="icon-tile mx-auto mb-4 h-14 w-14 rounded-2xl">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="text-display mb-2 text-2xl text-midnight-900">Club not found</h2>
          <p className="mb-6 text-midnight-500">The club you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>
    )
  }

  const Icon = Icons[club.logoIcon] || Users

  // Gallery placeholder tiles cycle through palette surfaces (club.logoColor is
  // legacy data and no longer drives colour).
  const GALLERY_TILES = [
    'bg-brand-200 text-midnight-900',
    'bg-glow-400 text-midnight-900',
    'bg-midnight-900 text-surface-50',
  ]

  return (
    <div className="min-h-screen bg-surface-50 pb-20">
      {/* Hero — club identity on an ink band */}
      <div className="relative overflow-hidden bg-midnight-900 text-surface-50">
        <div className="pointer-events-none absolute inset-0 bg-dots-dark mask-fade-b" />
        <div className="page-container relative pb-14 pt-28 sm:pt-32">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 rounded-full text-sm font-medium text-surface-50/70 transition-colors hover:text-surface-50">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-6 sm:flex-row sm:items-center"
          >
            <LogoTile icon={Icon} label={club.name} gradient="from-white/30 to-white/10" size="lg" />
            <div className="min-w-0">
              <span className="eyebrow-dark capitalize">{club.category}</span>
              <h1 className="text-display mb-3 mt-3 text-4xl text-surface-50 sm:text-5xl">{club.name}</h1>
              <p className="max-w-2xl text-lg leading-relaxed text-surface-50/75">{club.description}</p>
            </div>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={handleJoin}
              disabled={joining}
              className="btn-accent !px-6 !py-3"
            >
              <UserPlus className="h-4.5 w-4.5" />
              {joining ? 'Joining…' : 'Join club'}
            </button>
            {club.recruitmentOpen && (
              <button
                onClick={handleRegisterRecruitment}
                disabled={registering}
                className="btn-secondary !px-6 !py-3"
              >
                <ClipboardCheck className="h-4.5 w-4.5" />
                {registering ? 'Registering…' : 'Register for recruitment'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="page-container grid grid-cols-1 gap-10 py-14 lg:grid-cols-3 lg:gap-12">
        {/* Main content */}
        <div className="min-w-0 space-y-10 lg:col-span-2">
          <section className="surface-panel p-6 sm:p-8">
            <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-midnight-900">
              <span className="icon-tile h-9 w-9"><Sparkles className="h-4.5 w-4.5" /></span> About the club
            </h2>
            <p className="leading-relaxed text-midnight-600">{club.about}</p>
          </section>

          {club.vision && (
            <section className="surface-lilac p-6 sm:p-8">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-midnight-900">
                <span className="icon-tile-dark h-9 w-9"><Target className="h-4.5 w-4.5" /></span> Vision
              </h2>
              <p className="leading-relaxed text-midnight-800">{club.vision}</p>
            </section>
          )}

          {club.activities?.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold text-midnight-900">Activities</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {club.activities.map((activity) => (
                  <div key={activity} className="surface-panel flex items-center gap-3 p-4 font-medium text-midnight-800">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-midnight-900" aria-hidden="true" />
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
                    className={`relative flex aspect-square items-end overflow-hidden rounded-2xl border border-midnight-900/10 p-3 text-sm font-medium ${GALLERY_TILES[i % GALLERY_TILES.length]}`}
                  >
                    {i % GALLERY_TILES.length === 2 && <div className="pointer-events-none absolute inset-0 bg-dots-dark" aria-hidden="true" />}
                    <span className="relative">{item.caption}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {club.achievements?.length > 0 && (
            <section className="surface-panel p-6 sm:p-8">
              <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-midnight-900">
                <span className="icon-tile-lime h-9 w-9"><Trophy className="h-4.5 w-4.5" /></span> Achievements
              </h2>
              <ul className="space-y-2.5">
                {club.achievements.map((achievement) => (
                  <li key={achievement} className="flex items-start gap-2.5 text-midnight-600">
                    <Trophy className="mt-1 h-4 w-4 shrink-0 text-midnight-900" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar — membership & contacts */}
        <aside className="space-y-6">
          <div className="surface-panel p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="icon-tile-lime h-10 w-10">
                <Users className="h-4.5 w-4.5" />
              </div>
              <span className="font-display text-2xl font-bold text-midnight-900">
                <AnimatedCounter value={club.membersCount} />
              </span>
            </div>
            <p className="text-sm text-midnight-500">Active members</p>
            {club.recruitmentOpen && (
              <span className="badge-lime mt-4">Recruitment open</span>
            )}
          </div>

          {club.upcomingEvent?.title && (
            <div className="surface-panel-dark relative overflow-hidden p-6">
              <div className="pointer-events-none absolute inset-0 bg-dots-dark" aria-hidden="true" />
              <div className="relative">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-glow-400">
                  <Calendar className="h-4 w-4" /> Upcoming event
                </h3>
                <p className="font-semibold text-surface-50">{club.upcomingEvent.title}</p>
                <p className="mt-1 text-sm text-surface-50/70">
                  {new Date(club.upcomingEvent.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </p>
              </div>
            </div>
          )}

          {club.facultyCoordinator?.name && (
            <div className="surface-panel p-6">
              <h3 className="mb-3 font-semibold text-midnight-900">Faculty coordinator</h3>
              <p className="font-medium text-midnight-800">{club.facultyCoordinator.name}</p>
              <p className="text-sm text-midnight-500">{club.facultyCoordinator.designation}</p>
              {club.facultyCoordinator.email && (
                <a href={`mailto:${club.facultyCoordinator.email}`} className="link mt-3 inline-flex items-center gap-1.5 break-all text-sm">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" /> {club.facultyCoordinator.email}
                </a>
              )}
            </div>
          )}

          {club.coreTeam?.length > 0 && (
            <div className="surface-panel p-6">
              <h3 className="mb-4 font-semibold text-midnight-900">Core team</h3>
              <div className="divide-y divide-midnight-900/10">
                {club.coreTeam.map((member) => (
                  <div key={member.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <LogoTile label={member.name} gradient={club.logoColor} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-midnight-900">{member.name}</p>
                      <p className="text-xs text-midnight-500">{member.role} · {member.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default ClubDetails
