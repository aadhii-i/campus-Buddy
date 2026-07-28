import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, IndianRupee, CalendarClock, ArrowUpRight } from 'lucide-react'
import { placementCompanies } from '../../data/placementCompanies'
import SectionHeading from './SectionHeading'
import LogoTile from './LogoTile'

const PlacementHubSection = () => {
  return (
    <section className="py-20 bg-gray-50">
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
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 p-6 transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-5">
                <LogoTile label={company.name} gradient={company.gradient} size="lg" />
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{company.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> {company.role}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5"><IndianRupee className="w-4 h-4" /> Package</span>
                  <span className="font-semibold text-gray-900">{company.package}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5"><CalendarClock className="w-4 h-4" /> Deadline</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(company.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>

              <Link
                to="/placement-news"
                className="inline-flex items-center justify-center gap-1.5 w-full bg-gray-900 text-white rounded-full py-2.5 font-semibold text-sm hover:bg-gray-800 transition-colors duration-300"
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
