import React, { memo } from 'react'
import { Calendar, MapPin, Users, Clock, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { eventService } from '../services/eventService'
import { formatDate, formatTime, isToday, getDaysUntil } from '../utils/dateUtils'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const CATEGORY_STYLES = {
  academic: 'bg-brand-50 text-brand-700',
  cultural: 'bg-violet-50 text-violet-700',
  sports: 'bg-emerald-50 text-emerald-700',
  technical: 'bg-indigo-50 text-indigo-700',
  workshop: 'bg-amber-50 text-amber-700',
  seminar: 'bg-midnight-100 text-midnight-600',
  competition: 'bg-rose-50 text-rose-700',
  social: 'bg-pink-50 text-pink-700',
  career: 'bg-glow-500/10 text-glow-600',
}

const EventCard = memo(({ event, onUpdate }) => {
  const { user } = useAuth()

  const isRegistered = user && event.registrations?.some(
    reg => reg.user === user.id && reg.status === 'registered'
  )

  const isPastEvent = new Date(event.date) < new Date()
  const isFull = event.maxAttendees && event.currentAttendees >= event.maxAttendees
  const isEventToday = isToday(event.date)
  const daysUntil = getDaysUntil(event.date)

  const getCategoryStyle = (category) => CATEGORY_STYLES[category] || 'bg-midnight-100 text-midnight-600'

  const handleRegistration = async () => {
    if (!user) {
      toast.error('Please login to register for events')
      return
    }

    try {
      if (isRegistered) {
        await eventService.unregisterFromEvent(event._id)
        toast.success('Successfully unregistered from event')
      } else {
        await eventService.registerForEvent(event._id)
        toast.success('Successfully registered for event!')
      }
      onUpdate && onUpdate()
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-midnight-100 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      {/* Event Image / date-forward fallback header */}
      {event.images && event.images.length > 0 ? (
        <div className="relative h-44 overflow-hidden">
          <img
            src={event.images.find(img => img.isPrimary)?.url || event.images[0]?.url}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
          {isEventToday && !isPastEvent && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-brand-700 shadow-sm">
              Today
            </span>
          )}
        </div>
      ) : (
        <div className="relative flex h-24 items-center justify-between bg-midnight-900 px-5">
          <div className="text-white">
            <p className="text-[11px] font-semibold uppercase tracking-wide2 text-white/50">
              {new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}
            </p>
            <p className="font-display text-3xl font-bold leading-none">
              {new Date(event.date).getDate()}
            </p>
          </div>
          {!isPastEvent && (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-glow-400">
              {daysUntil}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Category Badge */}
        <div className="mb-3 flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getCategoryStyle(event.category)}`}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
          {isPastEvent && (
            <span className="rounded-full bg-midnight-100 px-2.5 py-1 text-[11px] font-medium text-midnight-500">
              Past event
            </span>
          )}
        </div>

        <h3 className="mb-2.5 line-clamp-2 text-lg font-bold text-midnight-900">
          {event.title}
        </h3>

        {/* Event Details */}
        <div className="mb-3 space-y-1.5">
          <div className="flex items-center text-sm text-midnight-500">
            <Calendar className="mr-2 h-4 w-4 flex-shrink-0 text-midnight-400" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center text-sm text-midnight-500">
            <Clock className="mr-2 h-4 w-4 flex-shrink-0 text-midnight-400" />
            <span>{formatTime(event.time)}</span>
          </div>

          <div className="flex items-center text-sm text-midnight-500">
            <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-midnight-400" />
            <span className="truncate">{event.location}</span>
          </div>

          {event.maxAttendees && (
            <div className="flex items-center text-sm text-midnight-500">
              <Users className="mr-2 h-4 w-4 flex-shrink-0 text-midnight-400" />
              <span>
                {event.currentAttendees || 0} / {event.maxAttendees} attendees
                {isFull && <span className="ml-1 text-rose-600">(Full)</span>}
              </span>
            </div>
          )}
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-midnight-500">
          {event.description}
        </p>

        {/* Organizer */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600">
            {event.organizer?.name?.charAt(0) || 'O'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-midnight-800">
              {event.organizer?.name || 'Unknown Organizer'}
            </p>
            <p className="truncate text-xs text-midnight-400">
              {event.organizer?.department}
            </p>
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="rounded-md bg-midnight-50 px-2 py-1 text-xs text-midnight-500">
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="rounded-md bg-midnight-50 px-2 py-1 text-xs text-midnight-500">
                +{event.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons — pinned to the bottom so mixed card heights stay aligned */}
        <div className="mt-auto flex gap-2 pt-1">
          {user && !isPastEvent && (
            <button
              onClick={handleRegistration}
              disabled={!isRegistered && isFull}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                isRegistered
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  : isFull
                  ? 'cursor-not-allowed bg-midnight-100 text-midnight-400'
                  : 'bg-brand-600 text-white hover:bg-brand-700'
              }`}
            >
              {isRegistered ? 'Unregister' : isFull ? 'Event full' : 'Register'}
            </button>
          )}

          <button
            onClick={() => { window.location.href = `/events/${event._id}` }}
            className="flex items-center gap-1.5 rounded-full border border-midnight-200 px-4 py-2.5 text-sm font-medium text-midnight-600 transition-colors duration-200 hover:border-brand-300 hover:text-brand-700"
          >
            Details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
})

EventCard.displayName = 'EventCard'

export default EventCard
