// src/components/General/QuickNotesSection.jsx

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Trash2 } from "lucide-react";
import generalNotesService from "@/appwrite/generalNotesServices"
const colors    = ["bg-yellow-200","bg-pink-200","bg-green-200","bg-blue-200"];
const rotations = ["rotate-1","-rotate-1","rotate-2","-rotate-2","rotate-3"];

export default function QuickNotesSection() {
  // get the logged-in user from Redux
  const currentUser = useSelector((s) => s.auth.userData);
  const userId      = currentUser?.$id;

  const [notes,   setNotes]   = useState([]);
  const [adding,  setAdding]  = useState(false);
  const [draft,   setDraft]   = useState("");
  const [loading, setLoading] = useState(true);

  // load notes from Appwrite when userId is available
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const res = await generalNotesService.listNotes(userId, 100);
        setNotes(res.documents);
      } catch (err) {
        console.error("Failed to load notes:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !userId) return;

    try {
      const doc = await generalNotesService.createNote({ userId, text });
      // doc has $id, text, createdAt
      setNotes((prev) => [doc, ...prev]);
      setDraft("");
      setAdding(false);
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await generalNotesService.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.$id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  return (
    <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Quick Notes</h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
            aria-label="Add note"
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
              onClick={() => { setAdding(false); setDraft(""); }}
              className="px-3 py-1 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Loading / Empty States */}
      {loading ? (
        <p className="text-gray-400">Loading notes…</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-400">No notes yet. Add one above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note, idx) => (
            <div
              key={note.$id}
              className={`
                relative w-full p-5
                ${colors[idx % colors.length]}
                ${rotations[idx % rotations.length]}
                shadow-lg transform hover:scale-105 transition
              `}
            >
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(note.$id)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                aria-label="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Note Text */}
              <p className="text-gray-900 whitespace-pre-wrap">{note.text}</p>

              {/* Timestamp */}
              <div className="mt-2 text-xs text-gray-700">
                {new Date(note.$createdAt).toLocaleString("en-US", {
                  month: "short",
                  day:   "2-digit",
                  year:  "numeric",
                  hour:  "numeric",
                  minute:"2-digit",
                })}
              </div>
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
