import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import FeatureCard from '../components/FeatureCard'
import { Calendar, Search, Users, Briefcase, FileText, TrendingUp, Clock, Star } from 'lucide-react'
import { eventService } from '../services/eventService'
import { lostFoundService } from '../services/lostFoundService'
import { useAuth } from '../context/AuthContext'
import ClubsSection from '../components/home/ClubsSection'
import TimetableSection from '../components/home/TimetableSection'
import AttendanceSection from '../components/home/AttendanceSection'
import EventsCarouselSection from '../components/home/EventsCarouselSection'
import PlacementHubSection from '../components/home/PlacementHubSection'
import AIFeaturesSection from '../components/home/AIFeaturesSection'
import CommunityFeedSection from '../components/home/CommunityFeedSection'
import StudentSuccessSection from '../components/home/StudentSuccessSection'
import DownloadAppSection from '../components/home/DownloadAppSection'

const Home = () => {
  const [recentEvents, setRecentEvents] = useState([])
  const [recentItems, setRecentItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, isAuthenticated, openLoginModal } = useAuth()

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      const [eventsData, itemsData] = await Promise.all([
        eventService.getUpcomingEvents(3).catch(err => {
          console.error('Failed to fetch events:', err)
          return [] // Return empty array on error
        }),
        lostFoundService.getRecentItems(3).catch(err => {
          console.error('Failed to fetch items:', err)
          return [] // Return empty array on error
        })
      ])
      
      setRecentEvents(eventsData || []) // Ensure it's always an array
      setRecentItems(itemsData || []) // Ensure it's always an array
    } catch (error) {
      console.error('Failed to fetch home data:', error)
      // Set default empty arrays if everything fails
      setRecentEvents([])
      setRecentItems([])
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Calendar,
      title: 'Campus Events',
      description: 'Discover workshops, seminars, cultural events, and academic conferences happening on campus.',
      href: '/events',
      stats: [
        { value: '50+', label: 'Monthly Events' },
        { value: '1000+', label: 'Attendees' }
      ]
    },
    {
      icon: Search,
      title: 'Lost & Found',
      description: 'Report lost items or help others find their belongings with our smart matching system.',
      href: '/lost-found',
      stats: [
        { value: '95%', label: 'Success Rate' },
        { value: '24h', label: 'Avg Response' }
      ]
    },
    {
      icon: Users,
      title: 'Community Hub',
      description: 'Connect with peers, share experiences, and build lasting friendships in our community.',
      href: '/community',
      stats: [
        { value: '2000+', label: 'Active Users' },
        { value: '500+', label: 'Daily Posts' }
      ]
    },
    {
      icon: Briefcase,
      title: 'Placement Portal',
      description: 'Stay updated with latest job opportunities, company visits, and placement statistics.',
      href: '/placement-news',
      stats: [
        { value: '200+', label: 'Companies' },
        { value: '85%', label: 'Placement Rate' }
      ]
    },
    {
      icon: FileText,
      title: 'Resume Analyzer',
      description: 'Get AI-powered insights to improve your resume and increase your chances of getting hired.',
      href: '/resume-analyzer',
      stats: [
        { value: '10k+', label: 'Resumes Analyzed' },
        { value: '4.8★', label: 'User Rating' }
      ]
    }
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'CS Student',
      text: 'Campus Buddy helped me find my lost laptop within hours! The community is so helpful.',
      rating: 5
    },
    {
      name: 'Rahul Kumar',
      role: 'Placement Coordinator',
      text: 'The resume analyzer gave me actionable feedback that helped me land my dream job.',
      rating: 5
    },
    {
      name: 'Sneha Patel',
      role: 'Event Organizer',
      text: 'Managing events has never been easier. The platform streamlines everything perfectly.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero user={user} />

      {/* Ecosystem Section — asymmetric bento grid, not N identical cards */}
      <section className="bg-surface-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 max-w-2xl"
          >
            <span className="eyebrow">One product, one ecosystem</span>
            <h2 className="text-display mt-3 text-3xl text-midnight-900 sm:text-4xl">
              Everything campus life needs, in one place.
            </h2>
            <p className="mt-4 text-lg text-midnight-500">
              Five tools that used to live in five different apps — now working
              together as one connected experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 lg:row-span-2"
            >
              <FeatureCard {...features[4]} variant="spotlight" className="h-full" />
            </motion.div>

            {features.slice(0, 2).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.08 * (index + 1) }}
                className="lg:col-span-2"
              >
                <FeatureCard {...feature} className="h-full" />
              </motion.div>
            ))}

            {features.slice(2, 4).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.08 * (index + 3) }}
                className="lg:col-span-2"
              >
                <FeatureCard {...feature} variant="compact" className="h-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Campus Clubs */}
      <ClubsSection />

      {/* Timetable Management */}
      <TimetableSection />

      {/* Attendance Tracker */}
      <AttendanceSection />

      {/* Upcoming Events Carousel */}
      <EventsCarouselSection />

      {/* Recent Activity Section */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Recent Events */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="surface-panel p-6 sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-midnight-900">Upcoming events</h3>
                </div>
                <Link to="/events" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all</Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-xl bg-midnight-50"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {(recentEvents || []).length > 0 ? (
                    (recentEvents || []).map((event) => (
                      <div key={event._id} className="flex items-center gap-4 rounded-xl border border-midnight-100 p-4 transition-colors duration-200 hover:border-brand-200 hover:bg-brand-50/40">
                        <div className="flex h-11 w-11 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-midnight-900 text-white">
                          <span className="text-[9px] font-semibold uppercase leading-none text-white/50">{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                          <span className="text-sm font-bold leading-none">{new Date(event.date).getDate()}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-semibold text-midnight-900">{event.title}</h4>
                          <div className="mt-0.5 flex items-center text-xs text-midnight-400">
                            <Clock className="mr-1.5 h-3.5 w-3.5" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-midnight-400">
                      <Calendar className="mx-auto mb-3 h-10 w-10 text-midnight-200" />
                      <p className="text-sm">No upcoming events available</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Recent Lost & Found */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="surface-panel p-6 sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-midnight-900">Recent lost &amp; found</h3>
                </div>
                <Link to="/lost-found" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all</Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-xl bg-midnight-50"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {(recentItems || []).length > 0 ? (
                    (recentItems || []).map((item) => (
                      <div key={item._id} className="flex items-center gap-4 rounded-xl border border-midnight-100 p-4 transition-colors duration-200 hover:border-brand-200 hover:bg-brand-50/40">
                        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${item.type === 'lost' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          <Search className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-semibold text-midnight-900">{item.title}</h4>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-midnight-400">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              item.type === 'lost' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {item.type}
                            </span>
                            {item.location}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-midnight-400">
                      <Search className="mx-auto mb-3 h-10 w-10 text-midnight-200" />
                      <p className="text-sm">No lost &amp; found items available</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Placement Hub */}
      <PlacementHubSection />

      {/* AI Features */}
      <AIFeaturesSection />

      {/* Testimonials Section */}
      <section className="bg-surface-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-14 max-w-xl text-center"
          >
            <span className="eyebrow">Word on campus</span>
            <h2 className="text-display mt-3 text-3xl text-midnight-900 sm:text-4xl">What students say</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="surface-panel flex flex-col p-6"
              >
                <div className="mb-4 flex items-center gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="flex-1 text-[15px] leading-relaxed text-midnight-600">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-midnight-100 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-midnight-900">{testimonial.name}</div>
                    <div className="text-xs text-midnight-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Community */}
      <CommunityFeedSection />

      {/* Student Success */}
      <StudentSuccessSection />

      {/* Download App */}
      <DownloadAppSection />

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-midnight-950 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-mesh-dark" />
        <div className="pointer-events-none absolute inset-0 bg-noise" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow !text-glow-400">Ready when you are</span>
            <h2 className="text-display mt-3 text-3xl text-white sm:text-5xl">
              Your campus is more connected than you think.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
              Join the students already using Campus Buddy to stay on top of events,
              community, and their next opportunity.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {!user ? (
                <button onClick={openLoginModal} className="btn-primary !px-7 !py-3.5 !text-base">
                  Sign up now
                </button>
              ) : (
                <>
                  <Link to="/events" className="btn-primary !px-7 !py-3.5 !text-base">
                    Explore events
                  </Link>
                  <Link to="/community" className="rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-white/10">
                    Join community
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home