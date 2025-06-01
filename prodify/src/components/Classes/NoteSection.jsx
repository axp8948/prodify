// src/components/Classes/NotesSection.jsx
import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import NoteCard from './NoteCard'

export default function NotesSection({ classId }) {
  // 1) Local state for notes
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
    // …other initial notes if desired
  ])

  // 2) Search term state
  const [searchTerm, setSearchTerm] = useState('')

  // 3) Filter notes by title/content
  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) return notes
    const lower = searchTerm.toLowerCase()
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(lower) ||
        n.content.toLowerCase().includes(lower)
    )
  }, [notes, searchTerm])

  // 4) Add & Delete Handlers
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

  // 5) NEW: Update Handler
  const handleUpdateNote = (noteId, newTitle, newContent) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, title: newTitle, content: newContent } : n
      )
    )
  }

  return (
    <section className="bg-[#1f2937] rounded-lg shadow-md flex flex-col">
      {/* Section Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-600">
        <h2 className="text-2xl font-semibold text-white">Notes</h2>
        <Button
          onClick={handleAddNote}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add Note</span>
        </Button>
      </div>

      {/* Section Body */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search notes…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* No Results / Notes Grid */}
        {filteredNotes.length === 0 ? (
          <p className="text-gray-400">
            {searchTerm
              ? 'No notes match your search.'
              : 'No notes yet. Click “Add Note” to create one.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 overflow-auto">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                createdAt={note.createdAt}
                onDelete={handleDeleteNote}
                onUpdate={handleUpdateNote} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
