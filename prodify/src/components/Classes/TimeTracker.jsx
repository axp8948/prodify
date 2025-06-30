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
  // ─── 1) Per‐category totals ─────────────────────────────────────────────
  const [lectureSeconds, setLectureSeconds] = useState(0);
  const [homeworkSeconds, setHomeworkSeconds] = useState(0);
  const [othersSeconds, setOthersSeconds] = useState(0);
  const [totalDocId, setTotalDocId] = useState(null);

  // ─── 2) Sessions array ─────────────────────────────────────────────────
  const [sessions, setSessions] = useState([]);

  // ─── 3) Stopwatch/state for current run ─────────────────────────────────
  const [currentActivity, setCurrentActivity] = useState("lecture");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // ─── Modal state ────────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // ─── 4) Load past sessions & totals ────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      const user = await authService.getCurrentUser();
      const sessResp = await sessionsService.listClassSessions(user.$id, classId);
      const loaded = sessResp.documents.map(d => ({
        date: d.sessionDate.split("T")[0],
        category: d.sessionType,
        seconds: d.totalTime,
      }));
      setSessions(loaded);

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

  // ─── 5) On mount: restore timer or show modal ─────────────────────────
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("timeTracking"));
    if (saved && saved.isRunning && saved.startTime) {
      setCurrentActivity(saved.activity);
      startTimeRef.current = saved.startTime;
      setIsRunning(true);
      setElapsedSec(Math.floor((Date.now() - saved.startTime) / 1000));
      intervalRef.current = setInterval(() => {
        setElapsedSec(Math.floor((Date.now() - saved.startTime) / 1000));
      }, 1000);
    } else {
      setShowModal(true);
      setModalVisible(true);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ─── 6) Start timer ──────────────────────────────────────────────────────
  const handleStart = () => {
    if (isRunning) return;
    const now = Date.now();
    startTimeRef.current = now;
    setIsRunning(true);
    localStorage.setItem(
      "timeTracking",
      JSON.stringify({ isRunning: true, startTime: now, activity: currentActivity })
    );
    setElapsedSec(0);
    intervalRef.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - now) / 1000));
    }, 1000);
  };

  // ─── 7) Stop timer, log to DB & update totals ───────────────────────────
  const handleStop = async () => {
    if (!isRunning) return;
    clearInterval(intervalRef.current);
    setIsRunning(false);
    localStorage.removeItem("timeTracking");

    const user = await authService.getCurrentUser();
    const isoDateTime = new Date().toISOString();
    const seconds = elapsedSec;

    await sessionsService.createClassSession({
      userId: user.$id,
      classId,
      sessionDate: isoDateTime,
      totalTime: seconds,
      sessionType: currentActivity,
    });

    let newLecture = lectureSeconds;
    let newHomework = homeworkSeconds;
    let newOthers = othersSeconds;

    if (currentActivity === "lecture") newLecture += seconds;
    else if (currentActivity === "homework") newHomework += seconds;
    else newOthers += seconds;

    if (totalDocId) {
      await sessionsService.updateSessionTotal(totalDocId, {
        lectureTotal: newLecture,
        homeworkTotal: newHomework,
        othersTotal: newOthers,
      });
    } else {
      const totDoc = await sessionsService.createSessionTotal({
        userId: user.$id,
        classId,
        lectureTotal: newLecture,
        homeworkTotal: newHomework,
        othersTotal: newOthers,
      });
      setTotalDocId(totDoc.$id);
    }

    setSessions(prev => [
      ...prev,
      { date: isoDateTime.split("T")[0], category: currentActivity, seconds },
    ]);
    setLectureSeconds(newLecture);
    setHomeworkSeconds(newHomework);
    setOthersSeconds(newOthers);
    setElapsedSec(0);
    startTimeRef.current = null;
  };

  // ─── Modal controls ────────────────────────────────────────────────────
  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setShowModal(false), 300);
  };
  const selectAndStart = act => {
    setCurrentActivity(act);
    closeModal();
    setTimeout(handleStart, 300);
  };

  // ─── 8) Grand total ─────────────────────────────────────────────────────
  const totalSeconds = lectureSeconds + homeworkSeconds + othersSeconds;

  return (
    <>
      {showModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
            modalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* darker overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-80"></div>

          <div
            className={`relative bg-gray-900 rounded-lg p-8 space-y-6 text-white transform transition-transform duration-300 ${
              modalVisible ? "scale-100" : "scale-95"
            }`}
            style={{ width: "90%", maxWidth: "400px" }}
          >
            {/* close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-2xl leading-none text-white hover:text-gray-400"
            >
              &times;
            </button>

            <p className="text-xl text-center">
              Which activity would you like to track?
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => selectAndStart("lecture")}
                className="px-5 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Lecture
              </button>
              <button
                onClick={() => selectAndStart("homework")}
                className="px-5 py-2 bg-green-600 rounded hover:bg-green-700"
              >
                Homework
              </button>
              <button
                onClick={() => selectAndStart("others")}
                className="px-5 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
              >
                Others
              </button>
            </div>
          </div>
        </div>
      )}

      {/* blur effect on background */}
      <div className={showModal ? "filter blur-md" : ""}>
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
            {["lecture", "homework", "others"].map(act => {
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
                <Button
                  onClick={handleStart}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                >
                  Start
                </Button>
              ) : (
                <Button
                  onClick={handleStop}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                >
                  Stop &amp; Log
                </Button>
              )}
            </div>
          </div>

          {/* D) Per‐Category Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center shadow-md">
              <h3 className="text-xl font-semibold text-white mb-2">Lecture</h3>
              <div className="text-2xl font-mono text-white">
                {formatSeconds(lectureSeconds)}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center shadow-md">
              <h3 className="text-xl font-semibold text-white mb-2">
                Homework &amp; Assignments
              </h3>
              <div className="text-2xl font-mono text-white">
                {formatSeconds(homeworkSeconds)}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center shadow-md">
              <h3 className="text-xl font-semibold text-white mb-2">Others</h3>
              <div className="text-2xl font-mono text-white">
                {formatSeconds(othersSeconds)}
              </div>
            </div>
          </div>

          {/* E) BarChart for “time per day, per category” */}
          <TimeChart sessions={sessions} />
        </div>
      </div>
    </>
  );
}
