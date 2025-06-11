// src/components/General/ChecklistSection.jsx

import React, { useState } from "react";
import { CheckCircle, Circle, Trash2, Plus } from "lucide-react";

export default function ChecklistSection() {
  const [tasks, setTasks]     = useState([
    { id: "t1", text: "Review project proposal", isCompleted: false },
    { id: "t2", text: "Buy groceries",            isCompleted: true  },
    { id: "t3", text: "Call Mom",                  isCompleted: false },
  ]);
  const [newText, setNewText] = useState("");
  const [adding, setAdding]   = useState(false);

  const handleAdd = e => {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;
    setTasks([{ id: `t${Date.now()}`, text, isCompleted: false }, ...tasks]);
    setNewText("");
    setAdding(false);
  };

  const toggleTask = id => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const removeTask = id => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">My Tasks</h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition"
            aria-label="Add task"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Add Task Form */}
      {adding && (
        <form onSubmit={handleAdd} className="mb-4 space-y-2">
          <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="What’s next…"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => { setAdding(false); setNewText(""); }}
              className="px-3 py-1 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks yet. Add one above.</p>
      ) : (
        <ul className="space-y-1">
          {tasks.map((t, idx) => (
            <li
              key={t.id}
              className={`flex items-center justify-between p-3 rounded-lg transition
                ${idx % 2 === 0 ? "bg-gray-900/50" : "bg-gray-800/50"}
                hover:bg-gray-900`}
            >
              <button
                onClick={() => toggleTask(t.id)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {t.isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <span
                  className={
                    t.isCompleted
                      ? "text-gray-400 line-through"
                      : "text-gray-100"
                  }
                >
                  {t.text}
                </span>
              </button>
              <button
                onClick={() => removeTask(t.id)}
                className="text-red-500 hover:text-red-600 focus:outline-none"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* View All Link */}
      <div className="mt-4 text-right">
        <button
          onClick={() => {/* navigate to full tasks page */}}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition"
        >
          View All Tasks →
        </button>
      </div>
    </section>
  );
}
