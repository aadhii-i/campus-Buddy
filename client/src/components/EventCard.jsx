import React, { useState, memo } from 'react'
import { Calendar, MapPin, Users, Clock, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { eventService } from '../services/eventService'
import { formatDate, formatTime, isToday, getDaysUntil } from '../utils/dateUtils'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const EventCard = memo(({ event, onUpdate }) => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const isRegistered = user && event.registrations?.some(
    reg => reg.user === user.id && reg.status === 'registered'
  )

  const isPastEvent = new Date(event.date) < new Date()
  const isFull = event.maxAttendees && event.currentAttendees >= event.maxAttendees
  const isEventToday = isToday(event.date)
  const daysUntil = getDaysUntil(event.date)

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      cultural: 'bg-purple-100 text-purple-800',
      sports: 'bg-green-100 text-green-800',
      technical: 'bg-indigo-100 text-indigo-800',
      workshop: 'bg-orange-100 text-orange-800',
      seminar: 'bg-gray-100 text-gray-800',
      competition: 'bg-red-100 text-red-800',
      social: 'bg-pink-100 text-pink-800',
      career: 'bg-yellow-100 text-yellow-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

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
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Event Image */}
      {event.images && event.images.length > 0 && (
        <div className="h-48 overflow-hidden">
          <img
            src={event.images.find(img => img.isPrimary)?.url || event.images[0]?.url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
          {isPastEvent && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              Past Event
            </span>
          )}
        </div>

        {/* Event Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {event.title}
        </h3>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatTime(event.time)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          
          {event.maxAttendees && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>
                {event.currentAttendees || 0} / {event.maxAttendees} attendees
                {isFull && <span className="text-red-600 ml-1">(Full)</span>}
              </span>
            </div>
          )}
        </div>

        {/* Event Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        {/* Organizer */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {event.organizer?.name?.charAt(0) || 'O'}
              </span>
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-900">
                {event.organizer?.name || 'Unknown Organizer'}
              </p>
              <p className="text-xs text-gray-500">
                {event.organizer?.department}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {user && !isPastEvent && (
            <button
              onClick={handleRegistration}
              disabled={!isRegistered && isFull}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                isRegistered
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : isFull
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRegistered ? 'Unregister' : isFull ? 'Event Full' : 'Register'}
            </button>
          )}
          
          <button
            onClick={() => {
              // Navigate to event details page
              window.location.href = `/events/${event._id}`
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View Details
          </button>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
})

EventCard.displayName = 'EventCard'

export default EventCard