// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Classes from './pages/Classes.jsx'
import ClassDetail from './pages/ClassDetail.jsx'
import JokesPage from './pages/Jokes.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import DailyDose from './pages/DailyDose.jsx'
import General from './pages/General.jsx'
import Finance from './pages/Finance.jsx'
import PhysicalActivities from './pages/PhysicalActivities.jsx'
import Prodix from './pages/Prodix.jsx'
import FlipClock from './components/FlipClock/FlipClock.jsx'
// …other imports

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* All routes share the same Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="classes/:classId" element={<ClassDetail />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jokes" element={<JokesPage />} />
          <Route path="/daily" element={<DailyDose />} />
          <Route path="/general" element={<General />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/activities" element={<PhysicalActivities />} />
          <Route path="/prodix" element={<Prodix />} />
          <Route path="/clock" element={<FlipClock/>} />
        


          {/* add more child routes here */}
        </Route>
      </Routes>
    </>
  )
}

