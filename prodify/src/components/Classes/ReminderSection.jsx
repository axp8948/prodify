// src/components/Classes/RemindersSection.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import dayjs from "dayjs";

import ReminderCard from "./ReminderCard";
import remindersService from "@/appwrite/classReminderServices";
import authService from "@/appwrite/auth";

export default function RemindersSection({ classId }) {
  // ─── state ────────────────────────────────────────────────────────────────
  const [reminders, setReminders]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState("");
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(false);

  // modal form state
  const [showForm, setShowForm] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput]   = useState("");
  const [dateInput, setDateInput]   = useState(dayjs().format("YYYY-MM-DD"));

  // ─── fetch existing reminders on mount or classId change ─────────────────
  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      try {
        const user = await authService.getCurrentUser();
        const resp = await remindersService.listReminders(user.$id, classId);
        // map Appwrite documents into our local shape
        setReminders(
          resp.documents.map((doc) => ({
            id:           doc.$id,
            title:        doc.title,
            description:  doc.description,
            dueAt:        doc.reminderAt,
            isCompleted:  doc.isCompleted,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch reminders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (classId) fetchReminders();
  }, [classId]);

  // ─── filtered reminders / search / upcoming toggle ────────────────────────
  const filteredReminders = useMemo(() => {
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
          dayjs(r.dueAt)
            .format("MMM D, YYYY")
            .toLowerCase()
            .includes(q)
        );
      }
      return true;
    });
  }, [reminders, searchTerm, showOnlyUpcoming]);

  // ─── handlers: delete & toggle complete ───────────────────────────────────
  const handleDeleteReminder = async (id) => {
    const ok = await remindersService.deleteReminder(id);
    if (ok) setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleComplete = async (id, current) => {
    const updated = await remindersService.updateReminder(id, {
      isCompleted: !current,
    });
    if (updated) {
      setReminders((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isCompleted: updated.isCompleted } : r
        )
      );
    }
  };

  // ─── handlers: modal open/close ──────────────────────────────────────────
  const toggleForm = () => {
    if (!showForm) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    setShowForm((prev) => !prev);
    setTitleInput("");
    setDescInput("");
    setDateInput(dayjs().format("YYYY-MM-DD"));
  };

  // ─── handler: submit new reminder ────────────────────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!titleInput.trim() || !dateInput) return;

    const user = await authService.getCurrentUser();
    const isoDate = dayjs(dateInput)
      .hour(9)
      .minute(0)
      .second(0)
      .toISOString();

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
    <section className="bg-[#1f2937] rounded-lg shadow-md flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-600">
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
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
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
              onChange={() => setShowOnlyUpcoming((prev) => !prev)}
              className="h-4 w-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
            />
            <span>Show Upcoming Only</span>
          </label>
        </div>

        {/* Loading / Empty / List */}
        {loading ? (
          <div className="text-gray-400 px-6 py-8">Loading reminders…</div>
        ) : filteredReminders.length === 0 ? (
          <div className="text-gray-400 px-6 py-8">
            {searchTerm || showOnlyUpcoming
              ? "No reminders match your filters."
              : "No reminders yet. Click “Add Reminder” to create one."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-auto p-6">
            {filteredReminders.map((r) => (
              <ReminderCard
                key={r.id}
                id={r.id}
                title={r.title}
                description={r.description}
                dueAt={r.dueAt}
                isCompleted={r.isCompleted}
                onDelete={() => handleDeleteReminder(r.id)}
                onToggleComplete={() =>
                  handleToggleComplete(r.id, r.isCompleted)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#2a2f36] w-11/12 max-w-md p-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Add New Reminder
              </h3>
              <button
                onClick={toggleForm}
                className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="reminderTitle" className="block text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  id="reminderTitle"
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="reminderDate" className="block text-gray-300 mb-1">
                  Date *
                </label>
                <input
                  id="reminderDate"
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="reminderDesc" className="block text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="reminderDesc"
                  rows={3}
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                  placeholder="Enter details (optional)"
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
