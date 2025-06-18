// src/components/PhysicalActivities/GoalsSection.jsx
import React, { useState } from "react";
import { MapPin, Clock, Footprints } from "lucide-react";

export default function GoalsSection() {
  const metrics = [
    {
      key: "checkin",
      label: "Check-Ins /wk",
      icon: MapPin,
      min: 0,
      max: 7,
      step: 1,
      color: "accent-amber-400",
    },
    {
      key: "duration",
      label: "Minutes /wk",
      icon: Clock,
      min: 0,
      max: 600,
      step: 15,
      color: "accent-teal-400",
    },
    {
      key: "steps",
      label: "Steps /day",
      icon: Footprints,
      min: 0,
      max: 20000,
      step: 500,
      color: "accent-sky-400",
    },
  ];

  const [goals, setGoals] = useState({
    checkin: 5,
    duration: 300,
    steps: 10000,
  });

  const handleSlide = (key) => (e) => {
    setGoals((g) => ({ ...g, [key]: Number(e.target.value) }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map(({ key, label, icon: Icon, min, max, step, color }) => (
          <div
            key={key}
            className="bg-gray-800 p-4 rounded-xl flex flex-col items-center"
          >
            <Icon className="w-6 h-6 text-white mb-1" />
            <h3 className="text-white font-medium mb-2">{label}</h3>
            <p className="text-white text-xl font-bold mb-2">
              {goals[key]}
            </p>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={goals[key]}
              onChange={handleSlide(key)}
              className={`w-full ${color} accent-2 accent-opacity-75`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
