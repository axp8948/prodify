// src/components/Classes/RemindersSection.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import dayjs from "dayjs";

import ReminderCard from "./ReminderCard";
import remindersService from "@/appwrite/classReminderServices";
import authService from "@/appwrite/auth";

export default function RemindersSection({ classId }) {
  const [reminders, setReminders]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState("");
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput]   = useState("");
  const [dateInput, setDateInput]   = useState(dayjs().format("YYYY-MM-DD"));

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      const user = await authService.getCurrentUser();
      const resp = await remindersService.listReminders(user.$id, classId);
      setReminders(
        resp.documents.map((doc) => ({
          id:           doc.$id,
          title:        doc.title,
          description:  doc.description,
          dueAt:        doc.reminderAt,
          isCompleted:  doc.isCompleted,
        }))
      );
      setLoading(false);
    };
    if (classId) fetchReminders();
  }, [classId]);

  const filtered = useMemo(() => {
    const now = dayjs();
    return reminders.filter((r) => {
      if (showOnlyUpcoming && dayjs(r.dueAt).isBefore(now, "day")) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          dayjs(r.dueAt).format("MMM D, YYYY").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reminders, searchTerm, showOnlyUpcoming]);

  const handleDelete      = async (id) => {
    const ok = await remindersService.deleteReminder(id);
    if (ok) setReminders((prev) => prev.filter((r) => r.id !== id));
  };
  const handleToggleComplete = async (id) => {
    const rem = reminders.find((r) => r.id === id);
    const updated = await remindersService.updateReminder(id, {
      isCompleted: !rem.isCompleted,
    });
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isCompleted: updated.isCompleted } : r
      )
    );
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setTitleInput("");
    setDescInput("");
    setDateInput(dayjs().format("YYYY-MM-DD"));
    document.body.classList.toggle("overflow-hidden", !showForm);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!titleInput.trim() || !dateInput) return;
    const user = await authService.getCurrentUser();
    const isoDate = dayjs(dateInput).hour(9).minute(0).second(0).toISOString();
    const doc = await remindersService.createReminder({
      userId:      user.$id,
      classId,
      title:       titleInput.trim(),
      description: descInput.trim(),
      reminderAt:  isoDate,
      isCompleted: false,
    });
    if (doc) {
      setReminders((prev) => [
        {
          id:           doc.$id,
          title:        doc.title,
          description:  doc.description,
          dueAt:        doc.reminderAt,
          isCompleted:  doc.isCompleted,
        },
        ...prev,
      ]);
      toggleForm();
    }
  };

  return (
    <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Reminders</h2>
        <Button
          onClick={toggleForm}
          className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? "Cancel" : "Add Reminder"}</span>
        </Button>
      </div>

      {/* Search & Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <input
          type="text"
          placeholder="Search reminders…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-3 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <label className="mt-3 sm:mt-0 flex items-center space-x-2 text-gray-200 select-none">
          <input
            type="checkbox"
            checked={showOnlyUpcoming}
            onChange={() => setShowOnlyUpcoming((p) => !p)}
            className="h-4 w-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
          />
          <span>Show Upcoming Only</span>
        </label>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <p className="text-gray-400">Loading reminders…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">
          {searchTerm || showOnlyUpcoming
            ? "No reminders match your filters."
            : "No reminders yet. Click “Add Reminder” to add one."}
        </p>
      ) : (
        <div className="relative pl-12">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-700"></div>
          <ul className="space-y-10">
            {filtered.map((r) => (
              <li key={r.id}>
                <ReminderCard
                  id={r.id}
                  title={r.title}
                  description={r.description}
                  dueAt={r.dueAt}
                  isCompleted={r.isCompleted}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#2a2f36] w-11/12 max-w-md p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Add New Reminder
              </h3>
              <button
                onClick={toggleForm}
                className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Date *</label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                  placeholder="Details (optional)"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
