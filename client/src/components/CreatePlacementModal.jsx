import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-card-hover"
      >
        <div className="flex items-center justify-between border-b border-midnight-100 px-6 py-4">
          <h3 className="text-lg font-bold text-midnight-900">Post opportunity</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-midnight-400 hover:bg-midnight-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">Title</label>
              <input name="title" value={form.title} onChange={handleChange} required className="form-input" />
            </div>
            <div>
              <label className="form-label">Company</label>
              <input name="company" value={form.company} onChange={handleChange} required className="form-input" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="form-input" />
            <input name="package" value={form.package} onChange={handleChange} placeholder="Package (e.g., ₹20-25 LPA)" className="form-input" />
            <select name="type" value={form.type} onChange={handleChange} className="form-select">
              {['Full-time','Internship','Contract'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">Deadline</label>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="form-textarea" />
          </div>

          <div>
            <label className="form-label">Requirements (one per line)</label>
            <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={3} className="form-textarea" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Posting…' : 'Post'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
