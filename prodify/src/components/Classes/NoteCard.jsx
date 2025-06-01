// src/components/NoteCard.jsx
import React from 'react'
import { Trash2 } from 'lucide-react'

export default function NoteCard({
  id,
  title,
  content,
  createdAt,
  onDelete,
}) {
  // Format createdAt as “Jun 5, 2025 – 14:30”
  const dateObj = new Date(createdAt)
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

  // Show only the first 100 characters of content
  const preview =
    content.length > 100 ? content.slice(0, 100) + '…' : content

  return (
    <div className="group relative">
      {/* Glassmorphic card */}
      <div
        className="
          bg-white/10 backdrop-blur-sm
          p-5 rounded-lg shadow-md
          hover:bg-white/20 hover:shadow-xl
          transition transform duration-200 ease-out
          flex flex-col justify-between
        "
      >
        {/* Top: Note Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mb-3">{formattedDate}</p>
          <p className="text-gray-300 text-sm leading-snug">
            {preview}
          </p>
        </div>

        {/* Bottom: “Read More” link */}
        <div className="mt-4">
          <a
            href="#"
            className="text-blue-400 text-sm hover:underline"
          >
            Read More
          </a>
        </div>
      </div>

      {/* Delete button (top-right corner) */}
      <button
        onClick={() => onDelete(id)}
        className="
          absolute top-2 right-2
          p-2 rounded-full
          bg-red-600 hover:bg-red-700
          text-white
          transition
        "
        aria-label={`Delete note ${title}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
