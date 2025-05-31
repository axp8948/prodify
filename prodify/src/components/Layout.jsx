// src/components/Layout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../components/Footer/Footer'
import BackgroundGrid from './BackgroundGrid'


const Layout = () => {

  // const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const isAuthenticated = true; // hard code for initial testing purpose

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Grid for background */}
      {/* <BackgroundGrid /> */}

      {/* Sticky header */}
      <header className="sticky top-0 z-50">
        <Header isAuthenticated={isAuthenticated} />
      </header>
      {/* Page content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}



export default Layout
