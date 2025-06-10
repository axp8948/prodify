// src/components/TimeTracker.jsx

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import TimeChart from "./TimeChart";
import sessionsService from "@/appwrite/classSessionsServices";
import authService from "@/appwrite/auth";

// Helper: format seconds ⇒ “Hh MMm SSs”
function formatSeconds(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${String(m).padStart(2, "0")}m`);
  parts.push(`${String(s).padStart(2, "0")}s`);
  return parts.join(" ");
}

export default function TimeTracker({ classId }) {
  // ─── 1) Per‐category totals (in seconds) ──────────────────────────────
  const [lectureSeconds, setLectureSeconds] = useState(0);
  const [homeworkSeconds, setHomeworkSeconds] = useState(0);
  const [othersSeconds, setOthersSeconds] = useState(0);
  // store the Appwrite totals doc ID (if exists)
  const [totalDocId, setTotalDocId] = useState(null);

  // ─── 2) Sessions array: each time you stop, push { date, category, seconds } ──
  const [sessions, setSessions] = useState([]);

  // ─── 3) Stopwatch/state for current run ──────────────────────────────────
  const [currentActivity, setCurrentActivity] = useState("lecture");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // ─── 4) On mount / class change, load past sessions & totals ─────────────
  useEffect(() => {
    const loadData = async () => {
      const user = await authService.getCurrentUser();
      // load individual sessions
      const sessResp = await sessionsService.listClassSessions(user.$id, classId);
      const loadedSessions = sessResp.documents.map((doc) => ({
        date:     doc.sessionDate.split("T")[0],
        category: doc.sessionType,
        seconds:  doc.totalTime,
      }));
      setSessions(loadedSessions);

      // load totals
      const totalResp = await sessionsService.getSessionTotal(user.$id, classId);
      if (totalResp.documents.length > 0) {
        const tot = totalResp.documents[0];
        setLectureSeconds(tot.lectureTotal);
        setHomeworkSeconds(tot.homeworkTotal);
        setOthersSeconds(tot.othersTotal);
        setTotalDocId(tot.$id);
      } else {
        setLectureSeconds(0);
        setHomeworkSeconds(0);
        setOthersSeconds(0);
        setTotalDocId(null);
      }
    };
    if (classId) loadData();
  }, [classId]);

  // ─── 5) Start timer ──────────────────────────────────────────────────────
  const handleStart = () => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now();
    setElapsedSec(0);
    intervalRef.current = setInterval(() => {
      const diffMs = Date.now() - startTimeRef.current;
      setElapsedSec(Math.floor(diffMs / 1000));
    }, 1000);
  };

  // ─── 6) Stop timer, log to DB & update totals ───────────────────────────
  const handleStop = async () => {
    if (!isRunning) return;
    clearInterval(intervalRef.current);
    setIsRunning(false);

    const user = await authService.getCurrentUser();
    const isoDateTime = new Date().toISOString();
    const seconds = elapsedSec;

    // 6a) Create classSessions record
    await sessionsService.createClassSession({
      userId:      user.$id,
      classId,
      sessionDate: isoDateTime,
      totalTime:   seconds,
      sessionType: currentActivity,
    });

    // 6b) Update totals in sessionTotals collection
    let newLecture = lectureSeconds;
    let newHomework = homeworkSeconds;
    let newOthers = othersSeconds;

    if (currentActivity === "lecture") {
      newLecture += seconds;
    } else if (currentActivity === "homework") {
      newHomework += seconds;
    } else {
      newOthers += seconds;
    }

    if (totalDocId) {
      await sessionsService.updateSessionTotal(totalDocId, {
        lectureTotal:  newLecture,
        homeworkTotal: newHomework,
        othersTotal:   newOthers,
      });
    } else {
      const totDoc = await sessionsService.createSessionTotal({
        userId:       user.$id,
        classId,
        lectureTotal:  newLecture,
        homeworkTotal: newHomework,
        othersTotal:   newOthers,
      });
      setTotalDocId(totDoc.$id);
    }

    // 6c) Update local state
    setSessions((prev) => [
      ...prev,
      {
        date:     isoDateTime.split("T")[0],
        category: currentActivity,
        seconds,
      },
    ]);
    setLectureSeconds(newLecture);
    setHomeworkSeconds(newHomework);
    setOthersSeconds(newOthers);

    // reset stopwatch
    setElapsedSec(0);
    startTimeRef.current = null;
  };

  // ─── 7) Cleanup on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ─── 8) Grand total ─────────────────────────────────────────────────────
  const totalSeconds = lectureSeconds + homeworkSeconds + othersSeconds;

  return (
    <div className="space-y-8">
      {/* A) Grand Total */}
      <div className="text-center">
        <p className="text-gray-300">
          Total time for{" "}
          <span className="text-white">{classId.toUpperCase()}</span>:
        </p>
        <div className="text-4xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400">
          {formatSeconds(totalSeconds)}
        </div>
      </div>

      {/* B) Activity Selector */}
      <div className="flex justify-center space-x-4">
        {["lecture", "homework", "others"].map((act) => {
          const labels = {
            lecture: "Lecture",
            homework: "Homework & Assignments",
            others: "Others",
          };
          const colors = {
            lecture: "blue-600",
            homework: "green-600",
            others: "yellow-600",
          };
          return (
            <button
              key={act}
              onClick={() => setCurrentActivity(act)}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentActivity === act
                  ? `bg-${colors[act]} text-white`
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {labels[act]}
            </button>
          );
        })}
      </div>

      {/* C) Stopwatch Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md flex flex-col items-center space-y-4">
        <p className="text-gray-300">
          Currently timing:{" "}
          <span className="text-white font-semibold">
            {currentActivity === "lecture"
              ? "Lecture"
              : currentActivity === "homework"
              ? "Homework & Assignments"
              : "Others"}
          </span>
        </p>
        <div className="text-5xl font-mono text-white">
          {formatSeconds(elapsedSec)}
        </div>
        <div className="space-x-4">
          {!isRunning ? (
            <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
              Start
            </Button>
          ) : (
            <Button onClick={handleStop} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2">
              Stop &amp; Log
            </Button>
          )}
        </div>
      </div>

      {/* D) Per‐Category Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center shadow-md">
          <h3 className="text-xl font-semibold text-white mb-2">Lecture</h3>
          <div className="text-2xl font-mono text-white">{formatSeconds(lectureSeconds)}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center shadow-md">
          <h3 className="text-xl font-semibold text-white mb-2">
            Homework &amp; Assignments
          </h3>
          <div className="text-2xl font-mono text-white">{formatSeconds(homeworkSeconds)}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center shadow-md">
          <h3 className="text-xl font-semibold text-white mb-2">Others</h3>
          <div className="text-2xl font-mono text-white">{formatSeconds(othersSeconds)}</div>
        </div>
      </div>

      {/* E) BarChart for “time per day, per category” */}
      <TimeChart sessions={sessions} />
    </div>
  );
}
