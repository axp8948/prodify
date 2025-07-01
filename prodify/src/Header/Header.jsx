// src/components/Header.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Clock from "../components/Clock"
import { useDispatch } from 'react-redux'
import authService from '@/appwrite/auth'
import {authLogout} from "../store/authSlice"

const Header = ({ isAuthenticated = false, onLogout }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onLogout (){
    authService
      .logout()
      .then(() => {
      dispatch(authLogout())
      navigate("/")
    }).catch(error => {
      console.error("Failed to delete Appwrite session:", err);
    })
  
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0d1117] bg-opacity-70 backdrop-blur-md border-b border-gray-600 px-6 py-4">
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
            {/* <Link to="/features" className="text-gray-300 hover:text-white transition">
              Features
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition">
              About
            </Link> */}
          </nav>

          {/* Authentication Buttons */}
          {!isAuthenticated ? (
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
          ) : (
            <Button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition"
            >
              Log Out
            </Button>

          
          )}

          <div className="flex items-center justify-center">
            <Clock />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
