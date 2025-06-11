// src/components/General/QuickNotesSection.jsx

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const initialNotes = [
  { id: "n1", text: "Brainstorm new app ideas", createdAt: "Jun 10, 2025 2:30 PM" },
  { id: "n2", text: "Buy gift for Sarah",            createdAt: "Jun 09, 2025 9:15 AM" },
  { id: "n3", text: "Read 20 pages of novel",         createdAt: "Jun 08, 2025 8:45 PM" },
];

const colors    = ["bg-yellow-200","bg-pink-200","bg-green-200","bg-blue-200"];
const rotations = ["rotate-1","-rotate-1","rotate-2","-rotate-2","rotate-3"];

export default function QuickNotesSection() {
  const [notes, setNotes] = useState(initialNotes);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    setNotes([{ id: `n${Date.now()}`, text, createdAt: formatted }, ...notes]);
    setDraft("");
    setAdding(false);
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Quick Notes</h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="p-2 bg-blue-600 rounded-full hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Add Note Form */}
      {adding && (
        <form onSubmit={handleAdd} className="mb-6 space-y-2">
          <textarea
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Jot down a thought…"
            className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setDraft("");
              }}
              className="px-3 py-1 bg-gray-700 text-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Notes Carousel */}
      {notes.length === 0 ? (
        <p className="text-gray-400">No notes yet. Add one above.</p>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {notes.slice(0, 5).map((note, idx) => (
            <div
              key={note.id}
              className={`
                relative w-48 min-w-[12rem] p-4
                ${colors[idx % colors.length]}
                ${rotations[idx % rotations.length]}
                shadow-lg transform hover:scale-105 transition
              `}
            >
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(note.id)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                aria-label="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Note Text */}
              <p className="text-gray-900 whitespace-pre-wrap">{note.text}</p>

              {/* Timestamp */}
              <div className="mt-2 text-xs text-gray-700">{note.createdAt}</div>
            </div>
          ))}
        </div>
      )}

      {/* View All Link */}
      <div className="mt-6 text-right">
        <button
          onClick={() => {/* navigate to full notes page */}}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          View All Notes →
        </button>
      </div>
    </section>
  );
}
