// src/components/General/ChecklistSection.jsx

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Trash2 } from "lucide-react";

const initialTasks = [
  { id: "t1", text: "Review project proposal", isCompleted: false },
  { id: "t2", text: "Buy groceries",            isCompleted: true  },
  { id: "t3", text: "Call Mom",                  isCompleted: false },
];

export default function ChecklistSection() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newText, setNewText] = useState("");

  const doneCount = useMemo(
    () => tasks.filter((t) => t.isCompleted).length,
    [tasks]
  );

  const handleAdd = (e) => {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;
    setTasks((prev) => [
      { id: `t${Date.now()}`, text, isCompleted: false },
      ...prev,
    ]);
    setNewText("");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <section className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md flex flex-col">
      <h2 className="text-xl font-semibold text-white mb-4">My Tasks</h2>

      {/* Add Task Form */}
      <form onSubmit={handleAdd} className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="What’s next…"
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Add
        </Button>
      </form>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="text-gray-300 text-sm mb-1">
          {doneCount} / {tasks.length} done
        </div>
        <div className="h-1 bg-gray-600 rounded overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-width duration-300"
            style={{
              width: tasks.length
                ? `${(doneCount / tasks.length) * 100}%`
                : "0%",
            }}
          />
        </div>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks yet. Add one above.</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-auto">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg hover:bg-gray-900 transition"
            >
              <button
                onClick={() => toggleTask(t.id)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {t.isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500" />
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
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* View All Link */}
      <div className="mt-4 text-right">
        <Button
          variant="link"
          className="text-sm text-blue-400 hover:text-blue-300"
          onClick={() => {/* navigate to full tasks page */}}
        >
          View All Tasks →
        </Button>
      </div>
    </section>
  );
}
