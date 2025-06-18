// src/components/PhysicalActivities/OtherActivitiesSection.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Activity } from "lucide-react";
import dayjs from "dayjs";
import PhysicalOtherService from "../../appwrite/physicalOtherServices";

export default function OtherActivitiesSection() {
  const userData = useSelector((state) => state.auth.userData);
  const userId   = userData?.$id;

  const [logs, setLogs]         = useState([]); // { id, activity, date, duration }
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState({ h: "", m: "" });

  // load existing other activities
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await PhysicalOtherService.listActivities(userId, 50);
        const docs = res.documents || [];
        const loaded = docs.map((doc) => {
          const totalMins = doc.duration;
          const h = Math.floor(totalMins / 60);
          const m = totalMins % 60;
          return {
            id:       doc.$id,
            activity: doc.activityName,
            date:     dayjs(doc.$createdAt).format("MMM D, YYYY"),
            duration: `${h}h ${m}m`,
          };
        });
        loaded.sort((a, b) =>
          dayjs(b.date, "MMM D, YYYY").unix() - dayjs(a.date, "MMM D, YYYY").unix()
        );
        setLogs(loaded);
      } catch (err) {
        console.error("Failed to load activities:", err);
      }
    })();
  }, [userId]);

  // handle new activity log
  const handleAdd = async () => {
    if (!userId || !activity || (!duration.h && !duration.m)) return;
    const h = parseInt(duration.h, 10) || 0;
    const m = parseInt(duration.m, 10) || 0;
    const totalMins = h * 60 + m;

    try {
      const created = await PhysicalOtherService.createActivity({
        userId,
        activityName: activity,
        duration:     totalMins,
      });
      const ch = Math.floor(created.duration / 60);
      const cm = created.duration % 60;
      const entry = {
        id:       created.$id,
        activity: created.activityName,
        date:     dayjs(created.$createdAt).format("MMM D, YYYY"),
        duration: `${ch}h ${cm}m`,
      };
      setLogs((prev) => [entry, ...prev]);
      setActivity("");
      setDuration({ h: "", m: "" });
    } catch (err) {
      console.error("Failed to add activity:", err);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-700">
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
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <div className="flex gap-3">
              <input
                type="number"
                min="0"
                placeholder="Hours"
                value={duration.h}
                onChange={(e) => setDuration({ ...duration, h: e.target.value })}
                className="w-1/2 px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
              />
              <input
                type="number"
                min="0"
                placeholder="Minutes"
                value={duration.m}
                onChange={(e) => setDuration({ ...duration, m: e.target.value })}
                className="w-1/2 px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            <button
              onClick={handleAdd}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition text-white font-medium"
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
                logs.map((log) => (
                  <li
                    key={log.id}
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
