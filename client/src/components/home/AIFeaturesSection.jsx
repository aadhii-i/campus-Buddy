import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { aiFeatures } from '../../data/aiFeatures'
import SectionHeading from './SectionHeading'

const AIFeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          light
          eyebrow="Powered by AI"
          title="AI Features Built for Your Success"
          subtitle="From your resume to your interview, let AI help you every step of the way."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/resume-analyzer"
              className="group block h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Resume Analyzer</h3>
              <p className="text-blue-100 text-sm mb-4">Get AI-powered insights to improve your resume instantly.</p>
              <span className="inline-flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
                Try it now <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>

          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.08 }}
              >
                <button
                  onClick={() => toast('Coming soon!', { icon: '✨' })}
                  className="group w-full text-left h-full bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                  <span className="inline-flex items-center gap-1 text-blue-300 text-sm font-medium group-hover:gap-2 transition-all">
                    Coming soon <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AIFeaturesSection
