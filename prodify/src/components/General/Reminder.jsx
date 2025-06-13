// src/components/General/GeneralRemindersSection.jsx

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Trash2, Check } from "lucide-react";
import dayjs from "dayjs";
import generalRemindersService from "@/appwrite/generalReminderServices";

export default function GeneralRemindersSection() {
  const currentUser = useSelector((state) => state.auth.userData);
  const userId      = currentUser?.$id;

  const [reminders, setReminders] = useState([]);
  const [adding,   setAdding]     = useState(false);
  const [title,    setTitle]      = useState("");
  const [desc,     setDesc]       = useState("");
  const [due,      setDue]        = useState(dayjs().format("YYYY-MM-DDTHH:mm"));
  const [loading,  setLoading]    = useState(true);

  // load reminders when userId is available
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const res = await generalRemindersService.listReminders(userId, 100);
        setReminders(res.documents);
      } catch (err) {
        console.error("Failed to load reminders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t || !due) return;

    try {
      const doc = await generalRemindersService.createReminder({
        userId,
        title: t,
        description: desc.trim(),
        dueAt: dayjs(due).toISOString(),
      });
      setReminders((prev) => [doc, ...prev]);
      setTitle("");
      setDesc("");
      setDue(dayjs().format("YYYY-MM-DDTHH:mm"));
      setAdding(false);
    } catch (err) {
      console.error("Failed to add reminder:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await generalRemindersService.deleteReminder(id);
      setReminders((prev) => prev.filter((r) => r.$id !== id));
    } catch (err) {
      console.error("Failed to delete reminder:", err);
    }
  };

  const toggleDone = async (rem) => {
    try {
      const updated = await generalRemindersService.updateReminder(rem.$id, {
        isDone: !rem.isDone,
      });
      setReminders((prev) =>
        prev.map((r) => (r.$id === updated.$id ? updated : r))
      );
    } catch (err) {
      console.error("Failed to toggle reminder:", err);
    }
  };

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
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-gray-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
          <textarea
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full bg-gray-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <input
            type="datetime-local"
            value={due}
            onChange={(e) => setDue(e.target.value)}
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

      {/* Loading / Empty */}
      {loading ? (
        <p className="text-gray-400">Loading reminders…</p>
      ) : reminders.length === 0 ? (
        <p className="text-gray-400">No reminders yet. Add one above.</p>
      ) : (
        <div className="relative pl-12">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-700"></div>

          <ul className="space-y-10">
            {reminders.map((r) => (
              <li key={r.$id} className="relative">
                {/* Dot */}
                <div
                  className={`absolute left-2 top-1 w-4 h-4 rounded-full border-2 ${
                    r.isDone
                      ? "bg-green-500 border-green-500"
                      : "bg-gray-800 border-gray-600"
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
                    <h3
                      className={`text-lg font-semibold text-white ${
                        r.isDone ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {r.title}
                    </h3>
                    <button
                      onClick={() => handleDelete(r.$id)}
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
                    Due:{" "}
                    {dayjs(r.dueAt).format("MMM D, YYYY h:mm A")}
                  </p>
                  <button
                    onClick={() => toggleDone(r)}
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
      )}

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
