// src/features/features.js
import {
  Bell,
  Clock,
  HeartPulse,
  Wallet,
  BarChart,
  MessageSquare,
} from 'lucide-react'

export const features = [
  {
    name: 'Tasks & Notes',
    Icon: Bell,
    to: '/general',
    desc: 'Create reminders, checklists, and notes—all in one place to keep your day on track.',
    iconClass: 'text-yellow-400',
  },
  {
    name: 'Time Tracker',
    Icon: Clock,
    to: '/mental',
    desc: 'Log class time spent on lectures, homework, and extra work—tailored per course.',
    iconClass: 'text-orange-400',
  },
  {
    name: 'Physical',
    Icon: HeartPulse,
    to: '/physical',
    desc: 'Track gym sessions, steps, and physical goals to stay active and consistent.',
    iconClass: 'text-red-400',
  },
  {
    name: 'Finance',
    Icon: Wallet,
    to: '/finance',
    desc: 'Manage your expenses, set budgets, and keep tabs on your financial habits.',
    iconClass: 'text-emerald-400',
  },
  {
    name: 'Stats',
    Icon: BarChart,
    to: '/activity',
    desc: 'See visual insights into your habits with personalized progress charts.',
    iconClass: 'text-pink-400',
  },
  {
    name: 'Chatbot',
    Icon: MessageSquare,
    to: '/chatbot',
    desc: 'Ask questions, plan routines, or get help—your personal assistant is here for it.',
    iconClass: 'text-purple-400',
  },
]
