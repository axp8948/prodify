// src/components/PhysicalActivities/GymTimeSection.jsx
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Clock } from "lucide-react";
import dayjs from "dayjs";

export default function GymTimeSection() {
  const [entries, setEntries] = useState([]);
  const [hours, setHours]     = useState("");
  const [minutes, setMinutes] = useState("");

  const handleAdd = () => {
    if (!hours && !minutes) return;
    const date = dayjs().format("MMM D, YYYY");
    setEntries([{ date, duration: `${hours||0}h ${minutes||0}m` }, ...entries]);
    setHours(""); setMinutes("");
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-700">
        <Clock className="w-6 h-6 text-white" />
        <h2 className="text-white text-lg font-semibold">Gym Duration</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form on left */}
          <div className="md:w-1/2 space-y-4">
            <input
              type="number"
              min="0"
              placeholder="Hours"
              value={hours}
              onChange={e => setHours(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="number"
              min="0"
              placeholder="Minutes"
              value={minutes}
              onChange={e => setMinutes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={handleAdd}
              className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 transition text-white font-medium"
            >
              Add Duration
            </button>
          </div>
          {/* History on right */}
          <div className="md:w-1/2">
            <ul className="max-h-64 overflow-auto space-y-2">
              {entries.length === 0 ? (
                <li className="text-gray-400">No durations logged yet.</li>
              ) : (
                entries.map((e, i) => (
                  <li
                    key={i}
                    className="flex justify-between bg-gray-700/60 p-3 rounded-lg text-gray-200"
                  >
                    <span>{e.date}</span>
                    <span className="font-semibold">{e.duration}</span>
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
