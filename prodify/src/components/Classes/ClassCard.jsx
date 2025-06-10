// src/components/ClassCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function ClassCard({ name, onDelete }) {
  // Normalize the route segment (e.g. "CS 3310" → "cs3310")
  const normalizedId = name.toLowerCase().replace(/\s+/g, "");

  return (
    <div className="relative group">
      {/* Entire card is clickable */}
      <Link
        to={`/classes/${normalizedId}`}
        className="
          bg-gradient-to-br from-[#1f2937] to-[#111827]
          min-h-[150px]
          flex items-center justify-center
          p-6
          rounded-xl
          shadow-lg
          hover:shadow-2xl
          transition transform duration-200 ease-out
          hover:scale-[1.02]
        "
      >
        {/* Only the class name, using Prodify accent color */}
        <h3 className="text-2xl font-bold text-blue-400 text-center">
          {name}
        </h3>
      </Link>

      {/* Delete button in top-right corner */}
      <button
        onClick={onDelete}
        className="
          absolute top-2 right-2
          p-2 rounded-full
          bg-red-600 hover:bg-red-700
          text-white
          transition
        "
        aria-label={`Delete class ${name}`}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
