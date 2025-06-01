// src/components/Classes/RemindersSection.jsx
import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import ReminderCard from './ReminderCard'
import dayjs from 'dayjs'

export default function RemindersSection({ classId }) {
  // ─── 1) Local state: list of reminders ────────────────────────────────────
  const [reminders, setReminders] = useState([
    {
      id: 'r1',
      title: 'Review Lecture 2',
      description: 'Go over slides and examples before Friday class.',
      dueAt: '2025-06-05T09:00:00Z',
    },
    {
      id: 'r2',
      title: 'Submit Homework 2',
      description: 'Make sure to upload PDF by next Monday night.',
      dueAt: '2025-06-08T23:59:00Z',
    },
  ])

  // ─── 2) UI state for filter/search ─────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(false)

  // ─── 3) UI state for “Add Reminder” form ───────────────────────────────────
  const [showForm, setShowForm] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const [descInput, setDescInput] = useState('')
  const [dateInput, setDateInput] = useState(
    dayjs().format('YYYY-MM-DD') // default to today
  )

  // ─── 4) Compute: filtered reminders based on search & upcoming toggle ──────
  const filteredReminders = useMemo(() => {
    const now = dayjs()
    return reminders.filter((r) => {
      // 4a) If “Upcoming Only” is checked, skip past dates
      if (showOnlyUpcoming && dayjs(r.dueAt).isBefore(now, 'day')) {
        return false
      }
      // 4b) If searchTerm exists, match in title or description or formatted date
      if (searchTerm.trim()) {
        const lower = searchTerm.toLowerCase()
        return (
          r.title.toLowerCase().includes(lower) ||
          r.description.toLowerCase().includes(lower) ||
          dayjs(r.dueAt)
            .format('MMM D, YYYY')
            .toLowerCase()
            .includes(lower)
        )
      }
      return true
    })
  }, [reminders, searchTerm, showOnlyUpcoming])

  // ─── 5) Handlers: Add, Delete ──────────────────────────────────────────────
  const handleDeleteReminder = (remId) => {
    setReminders((prev) => prev.filter((r) => r.id !== remId))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    // Basic validation: title and date are required
    if (!titleInput.trim() || !dateInput) return

    // Build a new reminder object
    const newId = `r${reminders.length + 1}`
    // Convert dateInput (YYYY-MM-DD) to ISO string at 09:00 local time
    const isoDate = dayjs(dateInput).hour(9).minute(0).second(0).toISOString()

    const newReminder = {
      id: newId,
      title: titleInput.trim(),
      description: descInput.trim(),
      dueAt: isoDate,
    }

    setReminders((prev) => [newReminder, ...prev])
    // Reset form
    setTitleInput('')
    setDescInput('')
    setDateInput(dayjs().format('YYYY-MM-DD'))
    setShowForm(false)
  }

  const handleFormCancel = () => {
    setTitleInput('')
    setDescInput('')
    setDateInput(dayjs().format('YYYY-MM-DD'))
    setShowForm(false)
  }

  return (
    <section className="bg-[#1f2937] rounded-lg shadow-md flex flex-col">
      {/* ─── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-600">
        <h2 className="text-2xl font-semibold text-white">Reminders</h2>
        <Button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Add Reminder'}</span>
        </Button>
      </div>

      {/* ─── “Add Reminder” Form (shows when showForm=true) ─────────────────── */}
      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="px-6 py-4 border-b border-gray-600 bg-[#272b32] flex flex-col space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label className="block text-gray-200 mb-1">Title *</label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter reminder title"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-200 mb-1">Date *</label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-gray-200 mb-1">Description</label>
            <textarea
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              className="w-full h-20 px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
              placeholder="Enter details (optional)"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleFormCancel}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
            >
              Save Reminder
            </button>
          </div>
        </form>
      )}

      {/* ─── Body: Search + Upcoming Toggle ───────────────────────────────────── */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <input
            type="text"
            placeholder="Search reminders…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-3 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <label className="mt-3 sm:mt-0 flex items-center space-x-2 text-gray-200 select-none">
            <input
              type="checkbox"
              checked={showOnlyUpcoming}
              onChange={() => setShowOnlyUpcoming((prev) => !prev)}
              className="h-4 w-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
            />
            <span>Show Upcoming Only</span>
          </label>
        </div>

        {/* ─── No Results or Grid of Cards ─────────────────────────────────── */}
        {filteredReminders.length === 0 ? (
          <p className="text-gray-400">
            {searchTerm || showOnlyUpcoming
              ? 'No reminders match your filters.'
              : 'No reminders yet. Click “Add Reminder” to create one.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 overflow-auto">
            {filteredReminders.map((r) => (
              <ReminderCard
                key={r.id}
                id={r.id}
                title={r.title}
                description={r.description}
                dueAt={r.dueAt}
                onDelete={handleDeleteReminder}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
