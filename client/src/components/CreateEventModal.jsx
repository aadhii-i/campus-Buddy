import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, CalendarPlus } from 'lucide-react'

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
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-event-title"
        className="modal-panel max-w-xl"
      >
        <div className="modal-header bg-brand-200/60">
          <div className="flex items-center gap-2.5">
            <div className="icon-tile-dark h-9 w-9">
              <CalendarPlus className="h-4 w-4" />
            </div>
            <h3 id="create-event-title" className="text-lg font-bold text-midnight-900">Create event</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="btn-icon">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div>
            <label htmlFor="create-event-title" className="form-label">Title</label>
            <input
              id="create-event-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., Tech Symposium 2025"
            />
          </div>

          <div>
            <label htmlFor="create-event-description" className="form-label">Description</label>
            <textarea
              id="create-event-description"
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
              <label htmlFor="create-event-date" className="form-label">Date</label>
              <input
                type="date"
                id="create-event-date"
              name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="create-event-time" className="form-label">Time</label>
              <input
                type="time"
                id="create-event-time"
              name="time"
                value={form.time}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="create-event-location" className="form-label">Location</label>
              <input
                id="create-event-location"
              name="location"
                value={form.location}
                onChange={handleChange}
                className="form-input"
                placeholder="Venue or link"
              />
            </div>
            <div>
              <label htmlFor="create-event-category" className="form-label">Category</label>
              <select
                id="create-event-category"
              name="category"
                value={form.category}
                onChange={handleChange}
                className="form-select"
              >
                {['academic','cultural','sports','technical','workshop','seminar','competition','social','career'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-midnight-900/10 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-ghost">
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
