// src/components/StatsSnapshot.jsx
import React from 'react'

export default function StatsSnapshot({ stats }) {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-12">
      {stats.map(({ label, value }) => (
        <div
          key={label}
          className="bg-gray-800 p-4 rounded-lg shadow-md text-center min-w-[100px]"
        >
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      ))}
    </div>
  )
}
