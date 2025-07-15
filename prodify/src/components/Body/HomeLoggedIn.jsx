// src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import sessionsService from '@/appwrite/classSessionsServices'
import Header from '../../Header/Header'
import FeatureCard from '../FeatureCard'
import {
  BookOpen,
  DollarSign,
  Activity,
  ListCheck,
  Laugh,
  Sparkles,
  MessagesSquare,
} from 'lucide-react'
import UpcomingDueBanner from '../Increments/UpcomingDueBanner'

export default function HomeLoggedIn() {
  const userData = useSelector((state) => state.auth.userData)
  const userName = userData?.name ?? ''
  const userId   = userData?.$id

  //  Track total seconds this week
  const [secondsThisWeek, setSecondsThisWeek] = useState(0)

  useEffect(() => {
    // ensure dark mode
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    if (!userId) return

    ;(async () => {
      try {
        //  Fetch all sessions
        const { documents } = await sessionsService.listAllSessions(userId)

        // Filter to last 7 days
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)

        const recent = documents.filter((doc) => {
          const sessionDate = new Date(doc.sessionDate)
          return sessionDate >= weekAgo
        })

        //  Sum totalTime *in seconds*
        const totalSeconds = recent.reduce(
          (sum, doc) => sum + (doc.totalTime || 0),
          0
        )

        setSecondsThisWeek(totalSeconds)
      } catch (err) {
        console.error('Failed to load sessions:', err)
      }
    })()
  }, [userId])

  // Helper: convert seconds to “X h Ym”
  const formatDuration = (secs) => {
    const hours   = Math.floor(secs / 3600)
    const minutes = Math.floor((secs % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const trackFeatures = [
    {
      name: 'Track Classes',
      Icon: BookOpen,
      to: '/classes',
      desc: 'See & log every class session, notes, and reminders.',
      iconClass: 'text-yellow-400',
    },
    {
      name: 'Track Finance',
      Icon: DollarSign,
      to: '/finance',
      desc: 'Log earnings, spending, and view your financial graph.',
      iconClass: 'text-green-400',
    },
    {
      name: 'Track Physical Activities',
      Icon: Activity,
      to: '/activities',
      desc: 'Record workouts, steps, and see your progress over time.',
      iconClass: 'text-blue-400',
    },
    {
      name: 'Track General',
      Icon: ListCheck,
      to: '/general',
      desc: 'Set reminders, checklists, and jot down quick notes.',
      iconClass: 'text-purple-400',
    },
    {
      name: 'Laugh Break',
      Icon: Laugh,
      to: '/jokes',
      desc: 'Need a giggle? Dive into some quick humor to lift your spirits!',
      iconClass: 'text-yellow-400',
    },
    {
      name: 'Daily Dose',
      Icon: Sparkles,
      to: '/daily',
      desc: 'Boost your day with a powerful word and an inspiring quote — all in one place.',
      iconClass:
        'text-gradient bg-gradient-to-r from-blue-400 to-orange-400 text-transparent bg-clip-text',
    },
    {
      name: 'Prodix',
      Icon: MessagesSquare,
      to: '/prodix',
      desc: 'Chat with Prodix for personalized insights on your tasks, progress, reminders and more—your AI productivity companion.',
      iconClass:
        'text-gradient bg-gradient-to-r from-emerald-400 to-lime-400 text-transparent bg-clip-text',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0d1013]">
      <UpcomingDueBanner userId={userId} />

      {/* Welcome Hero */}
      <div className="relative px-6 py-16 text-center">
        <div className="absolute inset-x-0 top-16 mx-auto w-11/12 max-w-3xl bg-white/5 backdrop-blur-sm rounded-xl" />
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-purple-800 to-orange-200">
            Welcome back, {userName}!
          </h2>
          <p className="text-gray-300 text-xl">
            You’ve spent{' '}
            <span className="font-semibold text-blue-400">
              {formatDuration(secondsThisWeek)}
            </span>{' '}
            tracking this week.
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="pt-24 px-6 pb-12">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white text-center mb-8">
          Hey {userName}, what’s the game plan today?
        </h1>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trackFeatures.map((feature) => (
            <FeatureCard
              key={feature.name}
              name={feature.name}
              Icon={feature.Icon}
              to={feature.to}
              desc={feature.desc}
              iconClass={feature.iconClass}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
