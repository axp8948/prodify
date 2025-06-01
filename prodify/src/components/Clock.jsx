// src/components/Clock.jsx
import React, { useState, useEffect } from 'react'

export default function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = String(time.getHours()).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')

  return (
     <div className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-purple-500 to-orange-900 px-4 py-2">
      <span className="font-mono text-2xl">
        {hours}:{minutes}:{seconds}
      </span>
    </div>
  )
}
