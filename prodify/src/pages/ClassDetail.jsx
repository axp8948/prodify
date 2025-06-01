// src/pages/ClassDetail.jsx
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import NoteCard from '../components/Classes/NoteCard'
import ReminderCard from '../components/Classes/ReminderCard'
import TimeTracker from '@/components/Classes/TimeTracker'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function ClassDetail() {
  const { classId } = useParams()

  // Dummy data; replace with real fetch in your app
  const [notes, setNotes] = useState([
    {
      id: 'n1',
      title: 'Lecture 1 – Introduction',
      content: 'Covered basics of vectors, definitions, and examples…',
      createdAt: '2025-06-01T10:15:00Z',
    },
    {
      id: 'n2',
      title: 'Homework 1 Discussion',
      content: 'Discussed problem set 1: determinants and matrix inverses…',
      createdAt: '2025-06-02T18:05:00Z',
    },
  ])

  const [reminders, setReminders] = useState([
    {
      id: 'r1',
      text: 'Review Lecture 2 before Friday',
      dueAt: '2025-06-05T09:00:00Z',
    },
    {
      id: 'r2',
      text: 'Submit Homework 2 by next Monday',
      dueAt: '2025-06-08T23:59:00Z',
    },
  ])

  // Placeholder handlers
  const handleAddNote = () => {
    const newId = `n${notes.length + 1}`
    const newNote = {
      id: newId,
      title: `New Note ${notes.length + 1}`,
      content: 'Your note content goes here…',
      createdAt: new Date().toISOString(),
    }
    setNotes((prev) => [newNote, ...prev])
  }

  const handleDeleteNote = (noteId) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
  }

  const handleAddReminder = () => {
    const newId = `r${reminders.length + 1}`
    const newReminder = {
      id: newId,
      text: `New reminder ${reminders.length + 1}`,
      dueAt: new Date(Date.now() + 86400000).toISOString(), // default tomorrow
    }
    setReminders((prev) => [newReminder, ...prev])
  }

  const handleDeleteReminder = (reminderId) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminderId))
  }

  return (
    <div className="min-h-screen bg-[#0d1013]">
      <main className="pt-24 px-6 pb-12 max-w-6xl mx-auto space-y-16">
        {/* Page Title */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            {classId.toUpperCase()}
          </h1>
          <p className="mt-2 text-gray-400">
            Overview of notes, upcoming reminders, and time tracking for this course.
          </p>
        </header>

        {/* === Notes + Reminders Container === */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Notes Panel */}
          <section className="bg-[#1f2937] rounded-lg shadow-md flex flex-col">
            {/* Section Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-600">
              <h2 className="text-2xl font-semibold text-white">Notes</h2>
              <Button
                onClick={handleAddNote}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Add Note</span>
              </Button>
            </div>

            {/* Section Body */}
            <div className="p-6 flex-1">
              {notes.length === 0 ? (
                <p className="text-gray-400">
                  No notes yet. Click “Add Note” to create one.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                  {notes.map((note) => (
                    <NoteCard
                      key={note.id}
                      id={note.id}
                      title={note.title}
                      content={note.content}
                      createdAt={note.createdAt}
                      onDelete={handleDeleteNote}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Reminders Panel */}
          <section className="bg-[#1f2937] rounded-lg shadow-md flex flex-col">
            {/* Section Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-600">
              <h2 className="text-2xl font-semibold text-white">Reminders</h2>
              <Button
                onClick={handleAddReminder}
                className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Add Reminder</span>
              </Button>
            </div>

            {/* Section Body */}
            <div className="p-6 flex-1">
              {reminders.length === 0 ? (
                <p className="text-gray-400">
                  No reminders yet. Click “Add Reminder” to create one.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                  {reminders.map((r) => (
                    <ReminderCard
                      key={r.id}
                      id={r.id}
                      text={r.text}
                      dueAt={r.dueAt}
                      onDelete={handleDeleteReminder}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* === Time Tracking Section === */}
        <section className="bg-[#1f2937] rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-600">
            <h2 className="text-2xl font-semibold text-white">Track Time</h2>
          </div>
          <div className="p-6">
            <TimeTracker classId={classId} />
          </div>
        </section>
      </main>
    </div>
  )
}
