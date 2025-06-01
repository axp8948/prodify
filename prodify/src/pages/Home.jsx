// src/pages/Home.jsx
import React from 'react'
import { useSelector } from 'react-redux'
import HomeNotLoggedIn from '../components/Body/HomeNotLoggedIn'
import HomeLoggedIn from '../components/Body/HomeLoggedIn'

export default function Home() {
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated)
  
  return isAuthenticated
    ? <HomeLoggedIn />
    : <HomeNotLoggedIn />
}
