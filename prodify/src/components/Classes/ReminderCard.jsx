// src/components/Classes/ReminderCard.jsx
import React from "react";
import { Trash2, Check } from "lucide-react";
import dayjs from "dayjs";

/**
 * Props:
 *   id: string
 *   title: string
 *   description: string
 *   dueAt: string (ISO)
 *   isCompleted: boolean
 *   onDelete(id: string): void
 *   onToggleComplete(id: string): void
 */
export default function ReminderCard({
  id,
  title,
  description,
  dueAt,
  isCompleted,
  onDelete,
  onToggleComplete,
}) {
  return (
    <div className="relative">
      {/* Timeline dot */}
      <div
        className={`
          absolute left-2 top-1 w-4 h-4 rounded-full border-2
          ${isCompleted
            ? "bg-green-500 border-green-500"
            : "bg-gray-800 border-gray-600"}
          flex items-center justify-center
        `}
      >
        {isCompleted && <Check className="w-3 h-3 text-white" />}
      </div>

      {/* Card */}
      <div
        className={`
          bg-gray-900/50 p-5 rounded-lg shadow-lg hover:bg-gray-900 transition
          ${isCompleted ? "opacity-60" : ""}
        `}
      >
        <div className="flex justify-between items-start">
          <h3
            className={`
              text-lg font-semibold text-white
              ${isCompleted ? "line-through text-gray-400" : ""}
            `}
          >
            {title}
          </h3>
          <button
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-600 focus:outline-none"
            aria-label="Delete reminder"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        {description && (
          <p className="mt-2 text-gray-300">{description}</p>
        )}
        <p className="mt-3 text-sm italic text-gray-400">
          Due: {dayjs(dueAt).format("MMM D, YYYY")}
        </p>
        <button
          onClick={() => onToggleComplete(id)}
          className="mt-4 inline-flex items-center space-x-2 text-sm text-green-400 hover:text-green-300"
        >
          <Check className="w-4 h-4" />
          <span>{isCompleted ? "Completed" : "Mark done"}</span>
        </button>
      </div>
    </div>
  );
}
