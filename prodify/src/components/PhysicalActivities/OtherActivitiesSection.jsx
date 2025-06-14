// src/components/PhysicalActivities/OtherActivitiesSection.jsx
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Activity } from "lucide-react";
import dayjs from "dayjs";

export default function OtherActivitiesSection() {
  const [logs, setLogs]           = useState([]);
  const [activity, setActivity]   = useState("");
  const [duration, setDuration]   = useState({ h: "", m: "" });

  const handleAdd = () => {
    if (!activity || (!duration.h && !duration.m)) return;
    const date = dayjs().format("MMM D, YYYY");
    setLogs([{ date, activity, duration: `${duration.h||0}h ${duration.m||0}m` }, ...logs]);
    setActivity(""); setDuration({ h: "", m: "" });
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-fuchsia-500 to-fuchsia-700">
        <Activity className="w-6 h-6 text-white" />
        <h2 className="text-white text-lg font-semibold">Other Activity</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form on left */}
          <div className="md:w-1/2 space-y-4">
            <input
              type="text"
              placeholder="Activity name"
              value={activity}
              onChange={e => setActivity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <div className="flex gap-3">
              <input
                type="number"
                min="0"
                placeholder="Hours"
                value={duration.h}
                onChange={e => setDuration({ ...duration, h: e.target.value })}
                className="w-1/2 px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
              />
              <input
                type="number"
                min="0"
                placeholder="Minutes"
                value={duration.m}
                onChange={e => setDuration({ ...duration, m: e.target.value })}
                className="w-1/2 px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            <button
              onClick={handleAdd}
              className="w-full py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 transition text-white font-medium"
            >
              Add Activity
            </button>
          </div>
          {/* History on right */}
          <div className="md:w-1/2">
            <ul className="max-h-64 overflow-auto space-y-2">
              {logs.length === 0 ? (
                <li className="text-gray-400">No activities logged yet.</li>
              ) : (
                logs.map((log, i) => (
                  <li
                    key={i}
                    className="space-y-1 bg-gray-700/60 p-3 rounded-lg text-gray-200"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{log.activity}</span>
                      <span>{log.date}</span>
                    </div>
                    <div className="text-sm opacity-80">{log.duration}</div>
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
