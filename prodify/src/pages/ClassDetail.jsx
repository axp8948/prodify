// src/pages/ClassDetail.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";

import NotesSection from "@/components/Classes/NoteSection";
import RemindersSection from "@/components/Classes/ReminderSection";
import TimeTracker from "@/components/Classes/TimeTracker";

import authService from "@/appwrite/auth";
import notesService from "@/appwrite/classNotesServices";
import remindersService from "@/appwrite/classReminderServices";
import sessionsService from "@/appwrite/classSessionsServices";

const tabs = ["Overview", "Notes", "Reminders", "Time"];

export default function ClassDetail() {
  const { classId } = useParams();
  const [tabIndex, setTabIndex] = useState(0);

  // Summary metrics
  const [noteCount, setNoteCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    const loadSummary = async () => {
      const user = await authService.getCurrentUser();
      const uid = user.$id;

      // Notes count
      const notesResp = await notesService.listNotes(uid, classId);
      setNoteCount(notesResp.documents.length);

      // Upcoming reminders
      const remResp = await remindersService.listReminders(uid, classId);
      const now = new Date();
      setUpcomingCount(
        remResp.documents.filter((d) => new Date(d.reminderAt) >= now).length
      );

      // Total minutes from sessionTotals (stored in seconds)
      const totResp = await sessionsService.getSessionTotal(uid, classId);
      if (totResp.documents.length > 0) {
        const tot = totResp.documents[0];
        const totalSec =
          tot.lectureTotal + tot.homeworkTotal + tot.othersTotal;
        setTotalMinutes(totalSec / 60);  // convert seconds → minutes
      } else {
        setTotalMinutes(0);
      }
    };

    loadSummary();
  }, [classId]);

  const formatMin = (m) => {
    const h = Math.floor(m / 60);
    const mm = Math.round(m % 60);
    return h > 0 ? `${h}h ${mm}m` : `${mm}m`;
  };

  // Quick‐tab shortcuts
  const openOverview  = () => setTabIndex(0);
  const openNotes     = () => setTabIndex(1);
  const openReminders = () => setTabIndex(2);
  const openTime      = () => setTabIndex(3);

  return (
    <div className="min-h-screen bg-[#0d1013]">
      <main className="pt-24 px-6 pb-12 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            {classId.toUpperCase()}
          </h1>
          <p className="mt-1 text-gray-400">
            Overview of notes, upcoming reminders, and time tracking.
          </p>
        </header>

        {/* Summary Cards (clickable) */}
        <div className="flex flex-wrap gap-4">
          <div
            onClick={openTime}
            className="cursor-pointer flex-1 min-w-[150px] bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 rounded-lg shadow hover:scale-105 transition"
          >
            <p className="text-sm">Total Time</p>
            <p className="text-2xl font-bold">{formatMin(totalMinutes)}</p>
          </div>
          <div
            onClick={openNotes}
            className="cursor-pointer flex-1 min-w-[150px] bg-gradient-to-r from-green-600 to-green-400 text-white p-4 rounded-lg shadow hover:scale-105 transition"
          >
            <p className="text-sm">Notes</p>
            <p className="text-2xl font-bold">{noteCount}</p>
          </div>
          <div
            onClick={openReminders}
            className="cursor-pointer flex-1 min-w-[150px] bg-gradient-to-r from-yellow-600 to-yellow-400 text-white p-4 rounded-lg shadow hover:scale-105 transition"
          >
            <p className="text-sm">Upcoming Reminders</p>
            <p className="text-2xl font-bold">{upcomingCount}</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-4 border-b border-gray-700">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setTabIndex(idx)}
              className={`pb-2 ${
                tabIndex === idx
                  ? "border-b-2 border-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {tabIndex === 0 && (
            <div className="text-gray-400">
              {/* Overview content */}
              Select a section above to view details.
            </div>
          )}
          {tabIndex === 1 && <NotesSection classId={classId} />}
          {tabIndex === 2 && <RemindersSection classId={classId} />}
          {tabIndex === 3 && <TimeTracker classId={classId} />}
        </div>
      </main>
    </div>
  );
}





