// src/components/TimeChart.jsx
import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

export default function TimeChart({ sessions }) {
  // 1) Aggregate sessions into per-day, per-category totals (in hours)
  const data = useMemo(() => {
    // Build a map: { "2025-06-01": { date: "2025-06-01", lecture: 0, homework: 0, others: 0 }, ... }
    const map = {}
    sessions.forEach(({ date, category, seconds }) => {
      if (!map[date]) {
        map[date] = { date, lecture: 0, homework: 0, others: 0 }
      }
      // Convert seconds ➔ hours (e.g. 3600s = 1h). You could also store as minutes (divide by 60).
      map[date][category] += seconds / 3600
    })

    // Turn into a sorted array by date ascending
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [sessions])

  // 2) Render a responsive, stacked bar chart
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-semibold text-white mb-4">
        Time Spent per Day (hours)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis
            stroke="#9CA3AF"
            label={{
              value: 'Hours',
              angle: -90,
              position: 'insideLeft',
              fill: '#9CA3AF',
            }}
          />
          <Tooltip
            wrapperStyle={{ backgroundColor: '#1f2937', border: 'none' }}
            labelStyle={{ color: '#9CA3AF' }}
            cursor={{ fill: 'rgba(255,255,255,0.1)' }}
          />
          <Legend wrapperStyle={{ color: '#9CA3AF' }} />

          {/* Stacked bars: one for lecture, one for homework, one for others */}
          <Bar dataKey="lecture" stackId="a" fill="#3b82f6" name="Lecture" />
          <Bar
            dataKey="homework"
            stackId="a"
            fill="#10b981"
            name="Homework"
          />
          <Bar dataKey="others" stackId="a" fill="#f59e0b" name="Others" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
