// src/components/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  // handler to block navigation
  const handleDisabledLink = (e) => {
    e.preventDefault()
  }

  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Prodify. All rights reserved.
        </p>
        <div className="flex space-x-4 text-sm">
          <Link to="/about" onClick={handleDisabledLink} className="hover:text-white">
            About
          </Link>
          <Link to="/help" onClick={handleDisabledLink} className="hover:text-white">
            Help
          </Link>
          <Link to="/feedback" onClick={handleDisabledLink} className="hover:text-white">
            Feedback
          </Link>
          <Link to="/privacy" onClick={handleDisabledLink} className="hover:text-white">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
