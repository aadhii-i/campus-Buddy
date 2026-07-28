import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react'
import { upcomingEventsShowcase } from '../../data/upcomingEventsShowcase'
import SectionHeading from './SectionHeading'
import CountdownTimer from './CountdownTimer'

const EventCard = ({ event, index }) => {
  const seatsFilled = Math.round(((event.totalSeats - event.seatsLeft) / event.totalSeats) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="snap-center shrink-0 w-[280px] sm:w-[320px] bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-shadow duration-300"
    >
      <div className={`relative h-36 bg-gradient-to-br ${event.gradient} flex items-end p-4`}>
        <PartyPopper className="absolute top-4 right-4 w-6 h-6 text-white/70" />
        <CountdownTimer target={event.date} />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-3 leading-snug">{event.title}</h3>
        <div className="space-y-1.5 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> {event.time}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {event.venue}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {event.seatsLeft} seats left</span>
            <span>{seatsFilled}% full</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full bg-gradient-to-r ${event.gradient}`} style={{ width: `${seatsFilled}%` }}></div>
          </div>
        </div>

        <Link
          to="/events"
          className="block text-center bg-gray-900 text-white rounded-full py-2.5 font-semibold text-sm hover:bg-gray-800 transition-colors duration-300"
        >
          Register
        </Link>
      </div>
    </motion.div>
  )
}

const EventsCarouselSection = () => {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4">
          <SectionHeading
            eyebrow="Don't Miss Out"
            title="Upcoming Events"
            subtitle="Handpicked campus events with live seat counts and countdowns."
          />
        </div>

        <div className="relative -mt-10">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            {upcomingEventsShowcase.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>

          <div className="hidden sm:flex justify-center gap-3 mt-6">
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventsCarouselSection
