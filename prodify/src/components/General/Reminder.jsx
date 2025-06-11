// src/components/General/GeneralRemindersSection.jsx

import React, { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";

const initialReminders = [
  {
    id: "r1",
    title: "Doctor’s Appointment",
    description: "Annual check-up at 3:00 PM",
    dueAt: "Jun 12, 2025 15:00",
    isDone: false,
  },
  {
    id: "r2",
    title: "Team Sync",
    description: "Project meeting on Zoom",
    dueAt: "Jun 13, 2025 10:00",
    isDone: false,
  },
  {
    id: "r3",
    title: "Pay Rent",
    description: "Due by end of day",
    dueAt: "Jun 15, 2025",
    isDone: true,
  },
];

export default function GeneralRemindersSection() {
  const [reminders, setReminders] = useState(initialReminders);
  const [adding, setAdding]       = useState(false);
  const [title, setTitle]         = useState("");
  const [desc, setDesc]           = useState("");
  const [due, setDue]             = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t || !due) return;
    setReminders([
      {
        id:      `r${Date.now()}`,
        title:   t,
        description: desc.trim(),
        dueAt:   new Date(due).toLocaleString("en-US", {
          month: "short", day: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        }),
        isDone:  false,
      },
      ...reminders,
    ]);
    setTitle(""); setDesc(""); setDue(""); setAdding(false);
  };

  const handleDelete = (id) =>
    setReminders(reminders.filter((r) => r.id !== id));

  const toggleDone = (id) =>
    setReminders(reminders.map((r) =>
      r.id === id ? { ...r, isDone: !r.isDone } : r
    ));

  return (
    <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Reminders Timeline</h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition"
            aria-label="Add reminder"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Add Reminder Form */}
      {adding && (
        <form onSubmit={handleAdd} className="mb-8 space-y-3">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-gray-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
          <textarea
            rows={2}
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full bg-gray-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <input
            type="datetime-local"
            value={due}
            onChange={e => setDue(e.target.value)}
            className="w-full bg-gray-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-1 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Timeline */}
      <div className="relative pl-12">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-700"></div>

        <ul className="space-y-10">
          {reminders.map((r) => (
            <li key={r.id} className="relative">
              {/* Dot */}
              <div
                className={`absolute left-2 top-1 w-4 h-4 rounded-full border-2 ${
                  r.isDone ? "bg-green-500 border-green-500" : "bg-gray-800 border-gray-600"
                } flex items-center justify-center`}
              >
                {r.isDone && <Check className="w-3 h-3 text-white" />}
              </div>

              {/* Card */}
              <div
                className={`bg-gray-900/50 p-5 rounded-lg shadow-lg hover:bg-gray-900 transition ${
                  r.isDone ? "opacity-60" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`text-lg font-semibold text-white ${
                    r.isDone ? "line-through text-gray-400" : ""
                  }`}>
                    {r.title}
                  </h3>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-500 hover:text-red-600 focus:outline-none"
                    aria-label="Delete reminder"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {r.description && (
                  <p className="mt-2 text-gray-300">{r.description}</p>
                )}
                <p className="mt-3 text-sm text-gray-400 italic">
                  Due: {r.dueAt}
                </p>
                <button
                  onClick={() => toggleDone(r.id)}
                  className="mt-4 inline-flex items-center space-x-2 text-sm text-green-400 hover:text-green-300"
                >
                  <Check className="w-4 h-4" />
                  <span>{r.isDone ? "Completed" : "Mark done"}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* View All */}
      <div className="mt-8 text-right">
        <button
          onClick={() => {/* navigate to full reminders page */}}
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition"
        >
          View All Reminders →
        </button>
      </div>
    </section>
  );
}
