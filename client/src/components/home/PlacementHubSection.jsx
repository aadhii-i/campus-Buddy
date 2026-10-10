import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, IndianRupee, CalendarClock, ArrowUpRight } from 'lucide-react'
import { placementCompanies } from '../../data/placementCompanies'
import SectionHeading from './SectionHeading'
import LogoTile from './LogoTile'

const PlacementHubSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-surface-100 border-y border-midnight-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Placement Hub"
          title="Top Companies Hiring Now"
          subtitle="Track live openings from companies visiting campus this season."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placementCompanies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="flex flex-col bg-surface-0 rounded-2xl border border-midnight-900/10 hover:border-midnight-900/30 hover:shadow-card-hover p-6 transition-[box-shadow,border-color] duration-300"
            >
              <div className="flex items-center gap-4 mb-5">
                <LogoTile label={company.name} gradient={company.gradient} size="lg" />
                <div>
                  <h3 className="font-bold text-lg text-midnight-900">{company.name}</h3>
                  <p className="text-midnight-600 text-sm flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> {company.role}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6 border-t border-midnight-900/10 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-midnight-600 flex items-center gap-1.5"><IndianRupee className="w-4 h-4" /> Package</span>
                  <span className="rounded-full bg-glow-400 px-2.5 py-0.5 font-semibold text-midnight-900">{company.package}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-midnight-600 flex items-center gap-1.5"><CalendarClock className="w-4 h-4" /> Deadline</span>
                  <span className="font-semibold text-midnight-900">
                    {new Date(company.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>

              <Link
                to="/placement-news"
                className="btn-primary mt-auto w-full"
              >
                Apply Now <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PlacementHubSection
