// src/components/Header.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const Header = ({ isAuthenticated = false }) => {
    return (
// src/components/Header.jsx

 <header className="sticky top-0 z-50 bg-[#0d1117] bg-opacity-70 backdrop-blur-md border-b border-gray-800 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-white">
        Prodify
      </Link>

      <div className="flex items-center space-x-4">
       {/* Nav links (optional) */}
       <nav className="hidden md:flex space-x-6">
         <Link to="/" className="text-gray-300 hover:text-white transition">
           Home
         </Link>
         <Link to="/features" className="text-gray-300 hover:text-white transition">
           Features
         </Link>
         <Link to="/about" className="text-gray-300 hover:text-white transition">
           About
         </Link>
       </nav>

        {/* Sign In / Sign Up */}
        {!isAuthenticated && (
          <>
            <Link to="/login">

             <Button className="border border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white transition">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">

             <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  </header>

    )
}

export default Header
