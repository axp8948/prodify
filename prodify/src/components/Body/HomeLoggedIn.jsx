// src/pages/Home.jsx
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Header from '../../Header/Header'
import FeatureCard from '../FeatureCard'
import { BookOpen, DollarSign, Activity, ListCheck } from 'lucide-react'

const HomeLoggedIn = () => {

    const userData = useSelector(state => state.auth.userData);
    const userName = userData?.name ?? '';

    useEffect(() => {
        // Ensure dark mode is enabled on <html>
        document.documentElement.classList.add('dark')
    }, [])

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
    ]



    return (
        <div className="min-h-screen bg-[#0d1013]">

                 {/* Welcome Hero */}
            <div className="relative px-6 py-16  text-center">
                {/* Frosted‐glass behind text */}
               <div className="absolute inset-x-0 top-16 mx-auto w-11/12 max-w-3xl bg-white/5 backdrop-blur-sm rounded-xl"></div>

                <div className="relative z-10 space-y-4">
                    {/* Gradient Heading */}
                    <h2 className="text-3xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-purple-500 to-orange-900">
                        Welcome back, {userName}!
                    </h2>
                    <p className="text-gray-300 text-xl">
                        You’ve spent <span className="font-semibold text-blue-400">12h 45m</span> tracking this week.
                    </p>
                </div>
            </div>

            {/* Main content */}
            <main className="pt-24 px-6 pb-12">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-white text-center mb-8">
                    Welcome back! What would you like to track today?
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

export default HomeLoggedIn