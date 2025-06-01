// src/components/ReminderCard.jsx
import React from 'react'
import { Trash2 } from 'lucide-react'

export default function ReminderCard({ id, text, dueAt, onDelete }) {
  // Format due date as “Jun 5, 2025 – 09:00”
  const dateObj = new Date(dueAt)
  const formattedDate =
    dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) +
    ' – ' +
    dateObj.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="group relative">
      <div
        className="
          bg-white/10 backdrop-blur-sm
          p-5 rounded-lg shadow-md
          hover:bg-white/20 hover:shadow-xl
          transition transform duration-200 ease-out
          flex flex-col justify-between
        "
      >
        <div>
          <p className="text-lg font-medium text-white mb-2">{text}</p>
          <p className="text-xs text-gray-400">Due: {formattedDate}</p>
        </div>
      </div>

      <button
        onClick={() => onDelete(id)}
        className="
          absolute top-2 right-2
          p-2 rounded-full
          bg-red-600 hover:bg-red-700
          text-white
          transition
        "
        aria-label={`Delete reminder: ${text}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
