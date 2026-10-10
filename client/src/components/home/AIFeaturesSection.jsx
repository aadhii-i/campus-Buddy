import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { aiFeatures } from '../../data/aiFeatures'
import SectionHeading from './SectionHeading'

const AIFeaturesSection = () => {
  return (
    <section className="py-20 sm:py-28 bg-brand-200 border-y border-midnight-900/10 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-dots mask-fade-b" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
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
              className="group flex flex-col h-full bg-midnight-900 rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-glow-400 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-midnight-900" />
              </div>
              <h3 className="text-lg font-semibold text-surface-50 mb-2">Resume Analyzer</h3>
              <p className="text-surface-50/70 text-sm mb-4">Get AI-powered insights to improve your resume instantly.</p>
              <span className="mt-auto inline-flex items-center gap-1 self-start rounded-full bg-glow-400 px-3 py-1.5 text-midnight-900 text-sm font-semibold group-hover:gap-2 transition-all">
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
                  className="group flex flex-col w-full text-left h-full bg-surface-0 border border-midnight-900/10 rounded-2xl p-6 hover:border-midnight-900/40 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="icon-tile w-12 h-12 mb-4 bg-brand-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-midnight-900 mb-2">{feature.title}</h3>
                  <p className="text-midnight-600 text-sm mb-4">{feature.description}</p>
                  <span className="mt-auto badge-outline self-start group-hover:gap-2 transition-all">
                    Coming soon <ArrowRight className="w-3.5 h-3.5" />
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
