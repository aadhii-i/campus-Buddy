import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Users, Calendar, UserCheck, ArrowRight } from 'lucide-react'
import { clubService } from '../../services/clubService'
import SectionHeading from './SectionHeading'
import GlassCard from './GlassCard'
import LogoTile from './LogoTile'
import AnimatedCounter from './AnimatedCounter'
import FloatingBlobs from './FloatingBlobs'

const ClubCard = ({ club, index }) => {
  const Icon = Icons[club.logoIcon] || Users

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 5) * 0.08 }}
    >
      <GlassCard className="p-6 h-full flex flex-col">
        <Link to={`/clubs/${club.slug}`} className="flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <LogoTile icon={Icon} label={club.name} gradient={club.logoColor} />
            <span className="text-xs font-medium text-blue-100 bg-white/10 px-2 py-1 rounded-full">
              {club.category}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-white mb-2">{club.name}</h3>
          <p className="text-blue-100/80 text-sm mb-4 leading-relaxed line-clamp-2">
            {club.description}
          </p>

          <div className="mt-auto space-y-2 text-sm text-blue-100/90 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span><AnimatedCounter value={club.membersCount} /> members</span>
            </div>
            {club.upcomingEvent?.title && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="truncate">{club.upcomingEvent.title}</span>
              </div>
            )}
            {club.facultyCoordinator?.name && (
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span className="truncate">{club.facultyCoordinator.name}</span>
              </div>
            )}
          </div>
        </Link>

        <Link
          to={`/clubs/${club.slug}`}
          className="mt-4 inline-flex items-center justify-center gap-2 bg-white text-blue-700 rounded-full py-2.5 font-semibold text-sm hover:bg-blue-50 transition-all duration-300 group-hover:gap-3"
        >
          Join Club
          <ArrowRight className="w-4 h-4" />
        </Link>
      </GlassCard>
    </motion.div>
  )
}

const ClubsSection = () => {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clubService.getAllClubs().then((data) => {
      setClubs(data)
      setLoading(false)
    })
  }, [])

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 overflow-hidden">
      <FloatingBlobs />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          light
          eyebrow="Campus Life"
          title="Discover Campus Clubs"
          subtitle="Explore student communities, participate in events, and build your network."
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/10 rounded-2xl h-64"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clubs.map((club, index) => (
              <ClubCard key={club._id || club.slug} club={club} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ClubsSection
