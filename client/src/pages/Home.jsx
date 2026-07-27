import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import FeatureCard from '../components/FeatureCard'
import { Calendar, Search, Users, Briefcase, FileText, TrendingUp, Clock, Star } from 'lucide-react'
import { eventService } from '../services/eventService'
import { lostFoundService } from '../services/lostFoundService'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const [recentEvents, setRecentEvents] = useState([])
  const [recentItems, setRecentItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()

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
      text: 'Campus Companion helped me find my lost laptop within hours! The community is so helpful.',
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

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Campus Life
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your campus experience with our comprehensive platform designed 
              specifically for students, by students.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent Events */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-8">
                <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Upcoming Events</h3>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {(recentEvents || []).length > 0 ? (
                    (recentEvents || []).map((event) => (
                      <div key={event._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                        <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No upcoming events available</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Recent Lost & Found */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-8">
                <Search className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Recent Lost & Found</h3>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {(recentItems || []).length > 0 ? (
                    (recentItems || []).map((item) => (
                      <div key={item._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                        <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                            item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {item.type}
                          </span>
                          {item.location}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No lost & found items available</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Hear from our community members about their experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already making the most of their campus experience
            </p>
            {!user ? (
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors duration-300">
                Sign Up Now
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="/events"
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors duration-300"
                >
                  Explore Events
                </a>
                <a
                  href="/community"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
                >
                  Join Community
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home