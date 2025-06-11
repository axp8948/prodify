// src/components/General/GeneralDashboard.jsx


import React, { useRef, useState } from "react";
import { CheckSquare, Bell, Edit3 } from "lucide-react";


import ChecklistSection from "@/components/General/Checklist";
import QuickNotesSection from "@/components/General/QuickNotes";
import GeneralRemindersSection from "@/components/General/Reminder";


const sections = [
  {
    key: "tasks",
    title: "Tasks",
    icon: CheckSquare,
    gradientClass: "bg-gradient-to-r from-green-500 to-green-700",
    component: <ChecklistSection />,
    value: "3 ／ 5",
  },
  {
    key: "notes",
    title: "Notes",
    icon: Edit3,
    gradientClass: "bg-gradient-to-r from-blue-500 to-blue-700",
    component: <QuickNotesSection />,
    value: "3",
  },
  {
    key: "reminders",
    title: "Reminders",
    icon: Bell,
    gradientClass: "bg-gradient-to-r from-yellow-500 to-yellow-700",
    component: <GeneralRemindersSection />,
    value: "3",
  },
];

export default function GeneralDashboard() {
  const [focus, setFocus] = useState(null);
  const refs = {
    tasks: useRef(null),
    notes: useRef(null),
    reminders: useRef(null),
  };

  const handleCardClick = (key) => {
    if (focus === key) {
      setFocus(null);
      return;
    }
    setFocus(key);
    refs[key].current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white">My Day</h1>
        <p className="text-gray-400 mt-1">
          A quick look at your tasks, notes, and reminders for today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-6">
        {sections.map(({ key, title, icon: Icon, gradientClass, value }) => (
          <SummaryCard
            key={key}
            title={title}
            value={value}
            icon={Icon}
            gradientClass={gradientClass}
            isActive={focus === key}
            onClick={() => handleCardClick(key)}
          />
        ))}
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {sections.map(({ key, component }) => {
          const dimmed = focus && focus !== key;
          return (
            <div
              key={key}
              ref={refs[key]}
              className={`transition-opacity duration-500 ${
                dimmed ? "opacity-30 pointer-events-none" : "opacity-100"
              }`}
            >
              {component}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  gradientClass,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`
      ${gradientClass}
      flex items-center gap-3 w-48 p-4 rounded-xl shadow-lg transform transition
      text-white
      ${isActive ? "scale-105 shadow-2xl" : "hover:scale-105 hover:shadow-2xl"}
    `}
  >
    <Icon className="w-6 h-6" />
    <div className="text-left">
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </button>
);