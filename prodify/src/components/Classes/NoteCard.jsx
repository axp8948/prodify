// src/components/Classes/NoteCard.jsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import dayjs from 'dayjs'

/**
 * Props:
 *   id: string
 *   title: string
 *   content: string
 *   createdAt: string (ISO)
 *   onDelete(id: string): void
 *   onUpdate(id: string, newTitle: string, newContent: string): void
 */
export default function NoteCard({
  id,
  title,
  content,
  createdAt,
  onDelete,
  onUpdate,
}) {
  // Local state to toggle between display/edit mode
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title)
  const [draftContent, setDraftContent] = useState(content)

  // If user cancels editing, revert drafts back to original props
  const handleCancel = () => {
    setDraftTitle(title)
    setDraftContent(content)
    setIsEditing(false)
  }

  // Save changes: call onUpdate, switch out of edit mode
  const handleSave = () => {
    // Don’t allow empty title
    if (!draftTitle.trim()) return
    onUpdate(id, draftTitle.trim(), draftContent.trim())
    setIsEditing(false)
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col justify-between shadow-md">
      {/** === Top Bar (Edit/Delete buttons) === */}
      <div className="flex justify-end space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="text-green-400 hover:text-green-500"
              title="Save"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-500"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-400 hover:text-blue-500"
              title="Edit"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="text-red-400 hover:text-red-500"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/** === Content Area === */}
      <div className="mt-2 flex-1">
        {isEditing ? (
          <>
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="w-full bg-gray-800 text-white px-2 py-1 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Note title"
            />
            <textarea
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              className="w-full h-24 bg-gray-800 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Note content"
            />
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-gray-200 text-sm">{content}</p>
          </>
        )}
      </div>

      {/** === Footer: Created At === */}
      {!isEditing && (
        <div className="mt-4 text-gray-400 text-xs">
          Created: {dayjs(createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      )}
    </div>
  )
}
