import React from 'react'
import { Link } from 'react-router-dom'

export default function FeatureCard({ name, Icon, to, desc, iconClass }) {
  return (
    <Link to={to} className="group h-full">
      <div
        className="
          h-full flex flex-col justify-between
          bg-gray-800 p-6 rounded-lg shadow-md
          transform transition duration-300 ease-out
          group-hover:scale-105
          group-hover:bg-gradient-to-tr
          group-hover:from-gray-900
          group-hover:to-gray-800
          group-hover:shadow-xl
        "
      >
        <div>
          <Icon
            className={`
              w-10 h-10 mb-4 text-white
              transition-transform duration-300
              group-hover:rotate-12
              group-hover:scale-110
              ${iconClass}
            `}
          />
          <h3
            className="
              text-xl font-semibold text-white mb-2
              transition-colors duration-300
              group-hover:text-orange-400
            "
          >
            {name}
          </h3>
          <p
            className="
              text-gray-400
              transition-colors duration-300
              group-hover:text-blue-400
            "
          >
            {desc}
          </p>
        </div>
      </div>
    </Link>
  )
}
