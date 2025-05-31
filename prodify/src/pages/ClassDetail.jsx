// src/pages/ClassDetail.jsx
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function ClassDetail() {
  // Read the classId param (e.g. "cs3330")
  const { classId } = useParams()

  // (In a real app, you might fetch class details by classId here)

  return (
    <div className="min-h-screen bg-[#0d1013]">
      {/* Header comes from Layout, so not repeated here */}

      <main className="pt-24 px-6 pb-12 max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-white mb-6">
          Class: {classId.toUpperCase()}
        </h1>

        {/* Three “action” buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* 1) Notes */}
          <Link to={`/classes/${classId}/notes`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Notes
            </Button>
          </Link>

          {/* 2) Reminders */}
          <Link to={`/classes/${classId}/reminders`}>
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
              Reminders
            </Button>
          </Link>

          {/* 3) Track Time */}
          <Link to={`/classes/${classId}/track-time`}>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Track Time
            </Button>
          </Link>
        </div>

        {/* Placeholder Section */}
        <div className="mt-12 text-gray-400 italic">
          Select an option above to manage {classId.toUpperCase()}.
        </div>
      </main>
    </div>
  )
}
