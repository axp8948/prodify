// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
// …other imports

export default function App() {
  return (
    <Routes>
      {/* All routes share the same Layout */}
      <Route element={<Layout />}>
        <Route path="/"      element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup"element={<Signup />} />
        {/* add more child routes here */}
      </Route>
    </Routes>
  )
}

