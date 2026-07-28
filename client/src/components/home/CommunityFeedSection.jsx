import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, TrendingUp, Megaphone } from 'lucide-react'
import { communityFeed } from '../../data/communityFeed'
import SectionHeading from './SectionHeading'

const TAG_STYLES = {
  trending: { label: 'Trending', icon: TrendingUp, className: 'bg-orange-100 text-orange-700' },
  announcement: { label: 'Announcement', icon: Megaphone, className: 'bg-blue-100 text-blue-700' },
  post: { label: 'Post', icon: null, className: 'bg-gray-100 text-gray-600' }
}

const CommunityFeedSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Campus Community"
          title="What's Happening on Campus"
          subtitle="Posts, announcements, and trending moments from your fellow students."
        />

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {communityFeed.map((post, index) => {
            const tag = TAG_STYLES[post.tag] || TAG_STYLES.post
            const TagIcon = tag.icon
            return (
              <motion.div
                key={post.author + index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                whileHover={{ y: -4 }}
                className="break-inside-avoid bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {post.initials}
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{post.author}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${tag.className}`}>
                    {TagIcon && <TagIcon className="w-3 h-3" />} {tag.label}
                  </span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-4">{post.content}</p>

                <div className="flex items-center gap-5 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {post.likes}</span>
                  <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> {post.comments}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/community"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            View Community
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CommunityFeedSection
