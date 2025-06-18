// src/components/PhysicalActivities/GymTimeSection.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Clock } from "lucide-react";
import dayjs from "dayjs";
import PhysicalGymDurationService from "../../appwrite/physicalGymDurationServices";

export default function GymTimeSection() {
  const userData = useSelector((state) => state.auth.userData);
  const userId   = userData?.$id;

  const [entries, setEntries] = useState([]); // { id, date, duration }
  const [hours, setHours]     = useState("");
  const [minutes, setMinutes] = useState("");

  // load existing durations
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await PhysicalGymDurationService.listDurations(userId, 50);
        const docs = res.documents || [];
        const loaded = docs.map((doc) => {
          const mins = doc.duration;
          const h = Math.floor(mins / 60);
          const m = mins % 60;
          return {
            id:       doc.$id,
            date:     dayjs(doc.$createdAt).format("MMM D, YYYY"),
            duration: `${h}h ${m}m`,
          };
        });
        // sort newest first
        loaded.sort((a, b) =>
          dayjs(b.date, "MMM D, YYYY").unix() - dayjs(a.date, "MMM D, YYYY").unix()
        );
        setEntries(loaded);
      } catch (err) {
        console.error("Failed to load durations:", err);
      }
    })();
  }, [userId]);

  // handle new duration
  const handleAdd = async () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const totalMins = h * 60 + m;
    if (!userId || totalMins === 0) return;

    try {
      const created = await PhysicalGymDurationService.createDuration({
        userId,
        duration: totalMins,
      });
      const ch = Math.floor(created.duration / 60);
      const cm = created.duration % 60;
      const entry = {
        id:       created.$id,
        date:     dayjs(created.$createdAt).format("MMM D, YYYY"),
        duration: `${ch}h ${cm}m`,
      };
      setEntries((prev) => [entry, ...prev]);
      setHours("");
      setMinutes("");
    } catch (err) {
      console.error("Failed to add duration:", err);
    }
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
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="number"
              min="0"
              placeholder="Minutes"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
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
                entries.map((e) => (
                  <li
                    key={e.id}
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
