// src/pages/Login.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '@/components/forms/LoginForm'

export default function Login() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const [values, setValues] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: dispatch Redux login action
    console.log('Logging in with', values)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Sign in to your account
        </h2>

        <LoginForm values={values} onChange={handleChange} onSubmit={handleSubmit} />

        <p className="mt-4 text-sm text-center text-gray-400">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
