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
import { Marquee } from '../common'

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
            <span className="badge-outline">
              {club.category}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-midnight-900 mb-2">{club.name}</h3>
          <p className="text-midnight-600 text-sm mb-4 leading-relaxed line-clamp-2">
            {club.description}
          </p>

          <div className="mt-auto space-y-2 text-sm text-midnight-600 border-t border-midnight-900/10 pt-4">
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
          className="btn-primary mt-4 w-full group-hover:gap-3"
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
    <section className="relative py-20 sm:py-28 bg-midnight-900 overflow-hidden">
      <FloatingBlobs />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          light
          eyebrow="Campus Life"
          title="Discover Campus Clubs"
          subtitle="Explore student communities, participate in events, and build your network."
        />

        {!loading && clubs.length > 0 && (
          <Marquee className="-mt-6 mb-12">
            {clubs.map((club) => (
              <span
                key={club._id || club.slug}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-surface-50/80"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-glow-400" />
                {club.name}
                <span className="text-surface-50/40">· {club.category}</span>
              </span>
            ))}
          </Marquee>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/[0.06] rounded-2xl h-64"></div>
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
