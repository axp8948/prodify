// src/components/Classes/ReminderCard.jsx
import React from 'react'
import { Trash2 } from 'lucide-react'
import dayjs from 'dayjs'

/**
 * Props:
 *   id: string
 *   title: string
 *   description: string
 *   dueAt: string (ISO)
 *   onDelete(id: string): void
 */
export default function ReminderCard({
  id,
  title,
  description,
  dueAt,
  onDelete,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col justify-between shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-gray-200 text-sm">{description}</p>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="text-red-400 hover:text-red-500"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-4 text-gray-400 text-xs">
        Due: {dayjs(dueAt).format('MMM D, YYYY')}
      </div>
    </div>
  )
}
