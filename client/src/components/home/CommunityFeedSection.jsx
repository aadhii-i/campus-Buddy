import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, TrendingUp, Megaphone } from 'lucide-react'
import { communityFeed } from '../../data/communityFeed'
import SectionHeading from './SectionHeading'

const TAG_STYLES = {
  trending: { label: 'Trending', icon: TrendingUp, className: 'bg-glow-400 text-midnight-900 border border-midnight-900/15' },
  announcement: { label: 'Announcement', icon: Megaphone, className: 'bg-midnight-900 text-surface-50' },
  post: { label: 'Post', icon: null, className: 'bg-brand-200 text-midnight-900' }
}

const CommunityFeedSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-surface-50">
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
                className="break-inside-avoid bg-surface-0 rounded-2xl p-5 border border-midnight-900/10 hover:border-midnight-900/30 hover:shadow-card-hover transition-[box-shadow,border-color] duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-midnight-900 text-sm font-bold">
                      {post.initials}
                    </div>
                    <span className="font-semibold text-midnight-900 text-sm">{post.author}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${tag.className}`}>
                    {TagIcon && <TagIcon className="w-3 h-3" />} {tag.label}
                  </span>
                </div>

                <p className="text-midnight-700 text-sm leading-relaxed mb-4">{post.content}</p>

                <div className="flex items-center gap-5 text-sm text-midnight-500 pt-3 border-t border-midnight-900/10">
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
            className="btn-primary !px-8 !py-3"
          >
            View Community
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CommunityFeedSection
