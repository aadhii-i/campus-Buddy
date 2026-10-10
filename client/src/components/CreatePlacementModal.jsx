import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Briefcase } from 'lucide-react'

const defaultData = {
  title: '',
  company: '',
  location: '',
  package: '',
  type: 'Full-time',
  deadline: '',
  description: '',
  requirements: ''
}

export default function CreatePlacementModal({ onClose, onCreate }) {
  const [form, setForm] = useState(defaultData)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onCreate({
        ...form,
        deadline: form.deadline ? new Date(form.deadline).toISOString().slice(0,10) : undefined,
        requirements: form.requirements
          ? form.requirements.split('\n').map((s) => s.trim()).filter(Boolean)
          : []
      })
      onClose()
    } catch (e) {
      // handled upstream
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-placement-title"
        className="modal-panel max-w-2xl"
      >
        <div className="modal-header bg-brand-200/60">
          <div className="flex items-center gap-2.5">
            <div className="icon-tile-dark h-9 w-9">
              <Briefcase className="h-4 w-4" />
            </div>
            <h3 id="create-placement-title" className="text-lg font-bold text-midnight-900">Post opportunity</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="btn-icon">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="placement-title" className="form-label">Title</label>
              <input id="placement-title" name="title" value={form.title} onChange={handleChange} required className="form-input" />
            </div>
            <div>
              <label htmlFor="placement-company-name" className="form-label">Company</label>
              <input id="placement-company-name" name="company" value={form.company} onChange={handleChange} required className="form-input" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="placement-location" className="form-label">Location</label>
              <input id="placement-location" name="location" value={form.location} onChange={handleChange} placeholder="Location" className="form-input" />
            </div>
            <div>
              <label htmlFor="placement-package" className="form-label">Package</label>
              <input id="placement-package" name="package" value={form.package} onChange={handleChange} placeholder="Package (e.g., ₹20-25 LPA)" className="form-input" />
            </div>
            <div>
              <label htmlFor="placement-type" className="form-label">Type</label>
              <select id="placement-type" name="type" value={form.type} onChange={handleChange} className="form-select">
                {['Full-time','Internship','Contract'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="placement-deadline" className="form-label">Deadline</label>
              <input id="placement-deadline" type="date" name="deadline" value={form.deadline} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div>
            <label htmlFor="placement-description" className="form-label">Description</label>
            <textarea id="placement-description" name="description" value={form.description} onChange={handleChange} rows={4} className="form-textarea" />
          </div>

          <div>
            <label htmlFor="placement-requirements" className="form-label">Requirements (one per line)</label>
            <textarea id="placement-requirements" name="requirements" value={form.requirements} onChange={handleChange} rows={3} className="form-textarea" />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-midnight-900/10 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Posting…' : 'Post'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
