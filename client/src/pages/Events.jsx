import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock, Plus, Search, X, ArrowUpRight } from 'lucide-react'
import { eventService } from '../services/eventService'
import { useAuth } from '../context/AuthContext'
import EventCard from '../components/EventCard'
import CreateEventModal from '../components/CreateEventModal'
import { PageHeader, EmptyState } from '../components/common'
import { motion } from 'framer-motion'

const CATEGORIES = [
  'academic', 'cultural', 'sports', 'technical',
  'workshop', 'seminar', 'competition', 'social', 'career'
]

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    search: ''
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchEvents()
  }, [filters])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await eventService.getAllEvents(filters)
      setEvents(response.events || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ category: '', date: '', search: '' })
  }

  const hasActiveFilters = filters.search || filters.category || filters.date
  const [featured, ...rest] = events

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 pt-28">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mb-3 h-8 w-1/3 rounded bg-midnight-100"></div>
            <div className="mb-8 h-4 w-1/2 rounded bg-midnight-100"></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-2xl border border-midnight-100 bg-white p-6">
                  <div className="mb-4 h-32 rounded-xl bg-midnight-100"></div>
                  <div className="mb-2 h-4 w-3/4 rounded bg-midnight-100"></div>
                  <div className="h-3 w-1/2 rounded bg-midnight-100"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <PageHeader
            eyebrow="Campus events"
            title="Discover what's happening on campus"
            description="Workshops, competitions, socials, and everything in between — curated in one live feed."
            actions={
              <button onClick={() => setShowCreateModal(true)} className="btn-primary flex-shrink-0">
                <Plus className="h-4 w-4" />
                Create event
              </button>
            }
          />

          {/* Filters */}
          <div className="surface-panel mt-8 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-400" />
                <input
                  type="text"
                  placeholder="Search events…"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="form-input pl-10"
                />
              </div>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="form-input md:w-44"
              />
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex flex-shrink-0 items-center gap-1.5 text-sm font-medium text-midnight-500 hover:text-brand-700">
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-midnight-100 pt-4">
              <button
                onClick={() => handleFilterChange('category', '')}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  !filters.category ? 'bg-brand-600 text-white' : 'bg-midnight-100 text-midnight-600 hover:bg-midnight-200'
                }`}
              >
                All
              </button>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => handleFilterChange('category', category)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors ${
                    filters.category === category ? 'bg-brand-600 text-white' : 'bg-midnight-100 text-midnight-600 hover:bg-midnight-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {events.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Calendar}
              title="No events found"
              description={hasActiveFilters ? 'Try adjusting your filters to see more events.' : 'No events are currently available.'}
              actionLabel={user ? 'Create the first event' : undefined}
              onAction={user ? () => setShowCreateModal(true) : undefined}
            />
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            {/* Featured event — the top match gets a distinct, larger treatment */}
            {featured && !hasActiveFilters && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group relative overflow-hidden rounded-3xl bg-midnight-950 text-white shadow-card-hover">
                <div className="pointer-events-none absolute inset-0 bg-mesh-dark" />
                <div className="pointer-events-none absolute inset-0 bg-noise" />
                <div className="relative grid grid-cols-1 gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <span className="eyebrow !text-glow-400">Featured event</span>
                    <h2 className="text-display mt-3 text-2xl leading-tight sm:text-3xl">{featured.title}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60 line-clamp-2">{featured.description}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-glow-400" /> {new Date(featured.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-glow-400" /> {featured.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-glow-400" /> {featured.location}</span>
                      {featured.maxAttendees && (
                        <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-glow-400" /> {featured.currentAttendees || 0}/{featured.maxAttendees}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => { window.location.href = `/events/${featured._id}` }}
                    className="flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-midnight-900 transition-transform duration-200 group-hover:-translate-y-0.5"
                  >
                    View event <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Remaining events grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {(featured && !hasActiveFilters ? rest : events).map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <EventCard event={event} user={user} onUpdate={fetchEvents} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {showCreateModal && (
          <CreateEventModal
            onClose={() => setShowCreateModal(false)}
            onCreate={async (payload) => {
              try {
                await eventService.createEvent(payload)
                await fetchEvents()
              } catch (err) {
                // Fallback: append locally when API is protected/unavailable
                const tempEvent = {
                  _id: Date.now().toString(),
                  ...payload,
                  currentAttendees: 0,
                  registrations: [],
                  createdAt: new Date().toISOString()
                }
                setEvents((prev) => [tempEvent, ...prev])
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Events
