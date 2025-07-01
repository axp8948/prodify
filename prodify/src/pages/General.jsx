// src/components/General/GeneralDashboard.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { CheckSquare, Edit3, Bell } from "lucide-react";

import ChecklistSection from "@/components/General/Checklist";
import QuickNotesSection from "@/components/General/QuickNotes";
import GeneralRemindersSection from "@/components/General/Reminder";

import ChecklistService from "@/appwrite/generalTasksServices";
import GeneralNotesService from "@/appwrite/generalNotesServices";
import GeneralRemindersService from "@/appwrite/generalReminderServices";

export default function GeneralDashboard() {
  const userId = useSelector((s) => s.auth.userData?.$id);
  const [focus, setFocus] = useState(null);
  const refs = {
    tasks: useRef(null),
    notes: useRef(null),
    reminders: useRef(null),
  };

  const [taskCounts, setTaskCounts] = useState({ done: 0, total: 0 });
  const [notesCount, setNotesCount] = useState(0);
  const [remindersCount, setRemindersCount] = useState(0);

  const loadCounts = useCallback(async () => {
    if (!userId) return;
    try {
      const [t, n, r] = await Promise.all([
        ChecklistService.listTasks(userId),
        GeneralNotesService.listNotes(userId),
        GeneralRemindersService.listReminders(userId),
      ]);
      const tasks = t.documents || [];
      setTaskCounts({
        done: tasks.filter((t) => t.completed).length,
        total: tasks.length,
      });
      setNotesCount(n.documents?.length || 0);
      setRemindersCount(r.documents?.length || 0);
    } catch (err) {
      console.error("Failed to load counts", err);
    }
  }, [userId]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const sections = [
    {
      key: "tasks",
      title: "Tasks",
      icon: CheckSquare,
      gradientClass: "bg-gradient-to-r from-green-500 to-green-700",
      value: `${taskCounts.done} ／ ${taskCounts.total}`,
      component: <ChecklistSection onChange={loadCounts} />,
    },
    {
      key: "notes",
      title: "Notes",
      icon: Edit3,
      gradientClass: "bg-gradient-to-r from-blue-500 to-blue-700",
      value: `${notesCount}`,
      component: <QuickNotesSection onChange={loadCounts} />,
    },
    {
      key: "reminders",
      title: "Reminders",
      icon: Bell,
      gradientClass: "bg-gradient-to-r from-yellow-500 to-yellow-700",
      value: `${remindersCount}`,
      component: <GeneralRemindersSection onChange={loadCounts} />,
    },
  ];

  const handleClick = (key) => {
    setFocus(focus === key ? null : key);
    if (refs[key].current) {
      refs[key].current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1013]">
      <div className="container mx-auto px-6 py-8 space-y-12  ">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-white">My Day</h1>
          <p className="text-gray-400 mt-1">
            A quick look at your tasks, notes, and reminders for today.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="flex flex-wrap gap-4">
          {sections.map(({ key, title, icon: Icon, gradientClass, value }) => (
            <SummaryCard
              key={key}
              title={title}
              value={value}
              icon={Icon}
              gradientClass={gradientClass}
              isActive={focus === key}
              onClick={() => handleClick(key)}
            />
          ))}
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {sections.map(({ key, component }) => {
            const dim = focus && focus !== key;
            return (
              <div
                key={key}
                ref={refs[key]}
                className={`transition-opacity duration-500 ${dim ? "opacity-30 pointer-events-none" : "opacity-100"
                  }`}
              >
                {component}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  gradientClass,
  isActive,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        ${gradientClass}
        flex items-center gap-3 w-44 p-4 rounded-2xl shadow-lg transform transition text-white
        ${isActive ? "scale-105 shadow-2xl" : "hover:scale-105 hover:shadow-2xl"}
      `}
    >
      <Icon className="w-6 h-6" />
      <div className="text-left">
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </button>
  );
}
