// src/components/Layout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../components/Footer/Footer'


const Layout = () => (
  <div className="flex flex-col min-h-screen">
    {/* Sticky header */}
    <header className="sticky top-0 z-50">
      <Header />
    </header>

    {/* Page content */}
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default Layout
