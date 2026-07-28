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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading club...</div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Club not found</h2>
        <p className="text-gray-600 mb-6">The club you're looking for doesn't exist.</p>
        <Link to="/" className="text-blue-600 font-semibold hover:underline">Back to Home</Link>
      </div>
    )
  }

  const Icon = Icons[club.logoIcon] || Users

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className={`relative bg-gradient-to-br ${club.logoColor} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <LogoTile icon={Icon} label={club.name} gradient="from-white/30 to-white/10" size="lg" />
            <div>
              <span className="text-white/80 text-sm font-medium uppercase tracking-wide">{club.category}</span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mt-1 mb-3">{club.name}</h1>
              <p className="text-white/90 text-lg max-w-2xl">{club.description}</p>
            </div>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={handleJoin}
              disabled={joining}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300 disabled:opacity-60"
            >
              <UserPlus className="w-5 h-5" />
              {joining ? 'Joining...' : 'Join Club'}
            </button>
            {club.recruitmentOpen && (
              <button
                onClick={handleRegisterRecruitment}
                disabled={registering}
                className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-300 disabled:opacity-60"
              >
                <ClipboardCheck className="w-5 h-5" />
                {registering ? 'Registering...' : 'Register for Recruitment'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" /> About the Club
            </h2>
            <p className="text-gray-600 leading-relaxed">{club.about}</p>
          </section>

          {club.vision && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" /> Vision
              </h2>
              <p className="text-gray-600 leading-relaxed">{club.vision}</p>
            </section>
          )}

          {club.activities?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Activities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {club.activities.map((activity) => (
                  <div key={activity} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-gray-700 font-medium">
                    {activity}
                  </div>
                ))}
              </div>
            </section>
          )}

          {club.gallery?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {club.gallery.map((item, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl bg-gradient-to-br ${club.logoColor} flex items-end p-3 text-white text-sm font-medium shadow-md`}
                  >
                    {item.caption}
                  </div>
                ))}
              </div>
            </section>
          )}

          {club.achievements?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" /> Achievements
              </h2>
              <ul className="space-y-2">
                {club.achievements.map((achievement) => (
                  <li key={achievement} className="flex items-start gap-2 text-gray-700">
                    <Trophy className="w-4 h-4 text-yellow-500 mt-1 shrink-0" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                <AnimatedCounter value={club.membersCount} />
              </span>
            </div>
            <p className="text-gray-500 text-sm">Active Members</p>
          </div>

          {club.upcomingEvent?.title && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Upcoming Event
              </h3>
              <p className="text-gray-700 font-medium">{club.upcomingEvent.title}</p>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(club.upcomingEvent.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </p>
            </div>
          )}

          {club.facultyCoordinator?.name && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Faculty Coordinator</h3>
              <p className="text-gray-700 font-medium">{club.facultyCoordinator.name}</p>
              <p className="text-gray-500 text-sm">{club.facultyCoordinator.designation}</p>
              {club.facultyCoordinator.email && (
                <a href={`mailto:${club.facultyCoordinator.email}`} className="mt-2 inline-flex items-center gap-1 text-blue-600 text-sm hover:underline">
                  <Mail className="w-4 h-4" /> {club.facultyCoordinator.email}
                </a>
              )}
            </div>
          )}

          {club.coreTeam?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Core Team</h3>
              <div className="space-y-3">
                {club.coreTeam.map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <LogoTile label={member.name} gradient={club.logoColor} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                      <p className="text-gray-500 text-xs">{member.role} · {member.year}</p>
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
