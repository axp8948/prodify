// src/components/ClassCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'

export default function ClassCard({
  id,
  name,
  instructor,
  courseCode,
  onDelete,
}) {
  // Normalize the courseCode for URL (e.g. "CS3330" → "cs3330")
  const normalizedId = courseCode.toLowerCase()

  return (
    <div className="group relative">
      {/* 1) Entire card is clickable and navigates to /classes/{normalizedId} */}
      <Link
        to={`/classes/${normalizedId}`}
        className="
          block 
          bg-white/10 backdrop-blur-sm    /* glassy background */
          p-6 rounded-lg shadow-md
          hover:bg-white/20 hover:shadow-xl
          transition transform duration-200 ease-out
        "
      >
        {/* Top: Class Info */}
        <div >
          <h3 className="text-xl font-semibold text-white mb-1">
            {name}
          </h3>
          {courseCode && (
            <p className="text-sm text-gray-300 mb-2">{courseCode}</p>
          )}
          {instructor && (
            <p className="text-gray-400">Instructor: {instructor}</p>
          )}
        </div>
      </Link>

      {/* 2) Delete button sits “above” the link (in top-right corner) */}
      <button
        onClick={onDelete}
        className="
          absolute top-2 right-2
          p-2 rounded-full
          bg-red-600 hover:bg-red-700
          text-white
          transition
        "
        aria-label={`Delete class ${name}`}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}
