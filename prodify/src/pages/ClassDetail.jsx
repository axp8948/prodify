// src/pages/ClassDetail.jsx
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import NoteCard from '../components/Classes/NoteCard'
import ReminderCard from '../components/Classes/ReminderCard'
import TimeTracker from '@/components/Classes/TimeTracker'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import NotesSection from '@/components/Classes/NoteSection'
import RemindersSection from '@/components/Classes/ReminderSection'

export default function ClassDetail() {
  const { classId } = useParams()


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

         <NotesSection classId={classId} />

          <RemindersSection classId={classId} />

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
