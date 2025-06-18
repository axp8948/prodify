// src/components/Classes/NotesSection.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import NoteCard from "./NoteCard";
import notesService from "@/appwrite/classNotesServices";
import authService from "@/appwrite/auth";
import dayjs from "dayjs";

export default function NotesSection({ classId }) {
  const [notes, setNotes]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [newTitle, setNewTitle]   = useState("");
  const [newContent, setNewContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      const user = await authService.getCurrentUser();
      const resp = await notesService.listNotes(user.$id, classId);
      setNotes(resp.documents);
      setLoading(false);
    };
    fetchNotes();
  }, [classId]);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return notes;
    const q = searchTerm.toLowerCase();
    return notes.filter((n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      dayjs(n.$createdAt).format("MMM D, YYYY").toLowerCase().includes(q)
    );
  }, [notes, searchTerm]);

  const handleAdd    = () => { setShowForm(true); setNewTitle(""); setNewContent(""); };
  const handleCancel = () => setShowForm(false);
  const handleSaveNew = async (e) => {
    e.preventDefault();
    const user = await authService.getCurrentUser();
    const doc = await notesService.createNote({
      userId:  user.$id,
      classId,
      title:   newTitle.trim(),
      content: newContent.trim(),
    });
    if (doc) {
      setNotes((prev) => [doc, ...prev]);
      setShowForm(false);
    }
  };
  const handleUpdate = async (id, title, content) => {
    const updated = await notesService.updateNote(id, { title, content });
    if (updated) {
      setNotes((prev) =>
        prev.map((n) => (n.$id === id ? updated : n))
      );
    }
  };
  const handleDelete = async (id) => {
    const ok = await notesService.deleteNote(id);
    if (ok) setNotes((prev) => prev.filter((n) => n.$id !== id));
  };

  return (
    <section className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">Notes</h2>
        <Button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
        >
          <Plus className="w-4 h-4" /><span>Add Note</span>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search notes…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <p className="text-gray-400">Loading notes…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">
          {searchTerm
            ? "No notes match your search."
            : "No notes yet. Click “Add Note” to create one."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((n, idx) => (
            <NoteCard
              key={n.$id}
              index={idx}
              id={n.$id}
              title={n.title}
              content={n.content}
              createdAt={n.$createdAt}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#2a2f36] w-11/12 max-w-lg p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Add New Note
              </h3>
              <button
                onClick={handleCancel}
                className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNew} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Content</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  Save Note
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
);
}
