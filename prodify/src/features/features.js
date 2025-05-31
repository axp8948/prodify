// src/features/features.js
import {
  Bell,
  ClipboardList,
  FileText,
  BarChart,
  MessageSquare,
} from 'lucide-react'

export const features = [
  {
    name: 'Reminders',
    Icon: Bell,
    to: '/reminders',
    desc: 'Never miss a task with scheduled notifications.',
    iconClass: 'text-yellow-400',
  },
  {
    name: 'Checklist',
    Icon: ClipboardList,
    to: '/checklist',
    desc: 'Organize your tasks with drag-and-drop lists.',
    iconClass: 'text-green-400',
  },
  {
    name: 'Notes',
    Icon: FileText,
    to: '/notes',
    desc: 'Keep everything in one place with rich-text notes.',
    iconClass: 'text-blue-400',
  },
  {
    name: 'Stats',
    Icon: BarChart,
    to: '/activity',
    desc: 'Visualize your progress with daily activity graphs.',
    iconClass: 'text-pink-400',
  },
  {
    name: 'Chatbot',
    Icon: MessageSquare,
    to: '/chatbot',
    desc: 'Talk to your personal assistant for quick help.',
    iconClass: 'text-purple-400',
  },
]
