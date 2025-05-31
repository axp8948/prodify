 // src/components/BackgroundGrid.jsx
import React from 'react'

export default function BackgroundGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="pattern-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0 L0 0 0 40"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern-grid)" />
    </svg>
  )
}
