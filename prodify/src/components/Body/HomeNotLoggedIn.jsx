// src/pages/Home.jsx
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import FeatureCard from '@/components/FeatureCard'
import { features } from '@/features/features'

const HomeNotLoggedIn = () => {
  useEffect(() => {
    // preserve user’s dark‐mode preference
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="relative min-h-screen bg-[#0d1013] overflow-hidden">

      {/* 1) Grid overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
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

      {/* 2) Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl lg:text-6xl font-extrabold text-white">
          <span>Prodify:</span>{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500">
            Your personalized tracker
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Never miss anything, and improve your productivity with reminders,
          checklists, notes, and more—tailored just for you.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/signup">
            <Button className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
            </Button>
          </Link>
          <Link to="/learn-more">
            <Button
              variant="outline"
              className="px-8 py-3 rounded-full border border-gray-400 text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      {/* 3) Features Grid */}
      <section className="relative z-10 mt-16 px-6 pb-24">
        <h2 className="text-2xl font-semibold text-center text-gray-200 mb-8">
          What Prodify Can Do
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f) => (
            <FeatureCard key={f.name} {...f} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomeNotLoggedIn