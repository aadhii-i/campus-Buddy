import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const defaultData = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  category: 'academic'
}

export default function CreateEventModal({ onClose, onCreate }) {
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
        date: form.date ? new Date(form.date).toISOString() : undefined
      })
      onClose()
    } catch (err) {
      // onCreate handles toasts/fallbacks
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
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-card-hover"
      >
        <div className="flex items-center justify-between border-b border-midnight-100 px-6 py-4">
          <h3 className="text-lg font-bold text-midnight-900">Create event</h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-midnight-400 hover:bg-midnight-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="form-label">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., Tech Symposium 2025"
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="form-textarea"
              placeholder="Tell attendees what this event is about"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="form-input"
                placeholder="Venue or link"
              />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-select"
              >
                {['academic','cultural','sports','technical','workshop','seminar','competition','social','career'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Creating…' : 'Create event'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
