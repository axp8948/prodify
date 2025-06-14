// src/components/Classes/NoteCard.jsx
import React, { useState } from "react";
import { Trash2, Edit2, Check, X } from "lucide-react";
import dayjs from "dayjs";

const colors    = ["bg-yellow-200","bg-pink-200","bg-green-200","bg-blue-200"];
const rotations = ["rotate-1","-rotate-1","rotate-2","-rotate-2","rotate-3"];

export default function NoteCard({
  index,
  id,
  title,
  content,
  createdAt,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing]   = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftContent, setDraftContent] = useState(content);

  const handleCancel = () => {
    setDraftTitle(title);
    setDraftContent(content);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!draftTitle.trim()) return;
    onUpdate(id, draftTitle.trim(), draftContent.trim());
    setIsEditing(false);
  };

  const bgClass      = colors[index % colors.length];
  const rotateClass  = rotations[index % rotations.length];

  return (
    <div className={`${bgClass} ${rotateClass} relative w-full p-5 shadow-lg transform hover:scale-105 transition`}>
      {/* Edit/Delete */}
      <div className="absolute top-2 right-2 flex space-x-2">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-green-600 hover:text-green-700" title="Save">
              <Check className="w-5 h-5" />
            </button>
            <button onClick={handleCancel} className="text-gray-600 hover:text-gray-700" title="Cancel">
              <X className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-700" title="Edit">
              <Edit2 className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(id)} className="text-red-600 hover:text-red-700" title="Delete">
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            className="w-full bg-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            rows={4}
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            className="w-full bg-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-gray-800 whitespace-pre-wrap">{content}</p>
          <div className="mt-4 text-gray-600 text-xs">
            {dayjs(createdAt).format("MMM D, YYYY h:mm A")}
          </div>
        </>
      )}
    </div>
  );
}
