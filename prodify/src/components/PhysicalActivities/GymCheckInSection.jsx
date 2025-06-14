// src/components/PhysicalActivities/GymCheckinSection.jsx
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { MapPin } from "lucide-react";
import dayjs from "dayjs";

export default function GymCheckinSection() {
  const [entries, setEntries] = useState([]);
  const today = dayjs().format("MMM D, YYYY");

  const handleCheckin = () => {
    if (entries[0] !== today) {
      setEntries([today, ...entries]);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-700">
        <MapPin className="w-6 h-6 text-white" />
        <h2 className="text-white text-lg font-semibold">Gym Check-In</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form / Button on left */}
          <div className="md:w-1/2">
            <button
              onClick={handleCheckin}
              className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 transition text-white font-medium"
            >
              {entries[0] === today ? "Checked In ✓" : "Check In Today"}
            </button>
          </div>
          {/* History on right */}
          <div className="md:w-1/2">
            <ul className="max-h-64 overflow-auto space-y-2">
              {entries.length === 0 ? (
                <li className="text-gray-400">No check-ins logged yet.</li>
              ) : (
                entries.map((d, i) => (
                  <li
                    key={i}
                    className="bg-gray-700/60 p-3 rounded-lg text-gray-200"
                  >
                    {d}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
);
}
