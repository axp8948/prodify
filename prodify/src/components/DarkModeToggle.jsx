// src/components/DarkModeToggle.jsx
import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    // persist preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // On mount, read saved preference
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setIsDark(saved === 'dark')
  }, [])

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-300" />
      )}
    </button>
  )
}
