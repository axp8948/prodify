// src/components/TimeTracker.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import TimeChart from './TimeChart' // ← we’ll create this in step 2

// Helper: format seconds ⇒ “Hh MMm SSs”
function formatSeconds(totalSec) {
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const parts = []
  if (h > 0) parts.push(`${h}h`)
  if (m > 0 || h > 0) parts.push(`${String(m).padStart(2, '0')}m`)
  parts.push(`${String(s).padStart(2, '0')}s`)
  return parts.join(' ')
}

export default function TimeTracker({ classId }) {
  // ─── 1) Per‐category totals (in seconds) ──────────────────────────────
  const [lectureSeconds, setLectureSeconds] = useState(0)
  const [homeworkSeconds, setHomeworkSeconds] = useState(0)
  const [othersSeconds, setOthersSeconds] = useState(0)

  // ─── 2) Sessions array: each time you stop, push { date, category, seconds } ──
  const [sessions, setSessions] = useState([])

  // ─── 3) Stopwatch/state for current run ──────────────────────────────────
  const [currentActivity, setCurrentActivity] = useState('lecture') // 'lecture' | 'homework' | 'others'
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedSec, setElapsedSec] = useState(0)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  // ─── 4) Start timer ──────────────────────────────────────────────────────
  const handleStart = () => {
    if (isRunning) return
    setIsRunning(true)
    startTimeRef.current = Date.now()
    setElapsedSec(0)
    intervalRef.current = setInterval(() => {
      const diffMs = Date.now() - startTimeRef.current
      setElapsedSec(Math.floor(diffMs / 1000))
    }, 1000)
  }

  // ─── 5) Stop timer, log to both "sessions" and per‐category totals ─────────
  const handleStop = () => {
    if (!isRunning) return
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsRunning(false)

    // 5a) Determine today’s date as “YYYY-MM-DD”
    const today = new Date().toISOString().split('T')[0]

    // 5b) Push a new session record
    setSessions((prev) => [
      ...prev,
      {
        date: today,
        category: currentActivity, // "lecture" | "homework" | "others"
        seconds: elapsedSec,
      },
    ])

    // 5c) Also add elapsedSec to that category’s total
    if (currentActivity === 'lecture') {
      setLectureSeconds((prev) => prev + elapsedSec)
    } else if (currentActivity === 'homework') {
      setHomeworkSeconds((prev) => prev + elapsedSec)
    } else {
      setOthersSeconds((prev) => prev + elapsedSec)
    }

    // 5d) Reset session‐timer
    setElapsedSec(0)
    startTimeRef.current = null
  }

  // ─── 6) Clear interval on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // ─── 7) Grand total (all categories combined) ───────────────────────────
  const totalSeconds = lectureSeconds + homeworkSeconds + othersSeconds

  return (
    <div className="space-y-8">
      {/* ────── A) Grand Total ─────────────────────────────────────────────── */}
      <div className="text-center">
        <p className="text-gray-300">
          Total time for{' '}
          <span className="text-white">{classId.toUpperCase()}</span>:
        </p>
        <div className="text-4xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400">
          {formatSeconds(totalSeconds)}
        </div>
      </div>

      {/* ────── B) Activity Selector ───────────────────────────────────────── */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setCurrentActivity('lecture')}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentActivity === 'lecture'
              ? 'bg-blue-600 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          Lecture
        </button>

        <button
          onClick={() => setCurrentActivity('homework')}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentActivity === 'homework'
              ? 'bg-green-600 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          Homework &amp; Assignments
        </button>

        <button
          onClick={() => setCurrentActivity('others')}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentActivity === 'others'
              ? 'bg-yellow-600 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          Others
        </button>
      </div>

      {/* ────── C) Stopwatch Card ───────────────────────────────────────────── */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md flex flex-col items-center space-y-4">
        <p className="text-gray-300">
          Currently timing:{' '}
          <span className="text-white font-semibold">
            {currentActivity === 'lecture'
              ? 'Lecture'
              : currentActivity === 'homework'
              ? 'Homework & Assignments'
              : 'Others'}
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

      {/* ────── D) Per‐Category Totals ──────────────────────────────────────── */}
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

      {/* ────── E) BarChart for “time per day, per category” ───────────────── */}
      <TimeChart sessions={sessions} />
    </div>
  )
}
