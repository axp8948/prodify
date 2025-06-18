// src/components/PhysicalActivities/GymCheckinSection.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "../ui/card";
import { MapPin } from "lucide-react";
import dayjs from "dayjs";
import PhysicalGymCheckinsService from "../../appwrite/physicalGymCheckInsServices";

export default function GymCheckinSection() {
  const userData = useSelector((state) => state.auth.userData);
  const userId   = userData?.$id;
  const [entries, setEntries] = useState([]); // [{ id, date }]
  const todayStr = dayjs().format("MMM D, YYYY");

  // load previous check-ins
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await PhysicalGymCheckinsService.listCheckins(userId, 50);
        const docs = res.documents || [];
        const loaded = docs.map(doc => ({
          id:   doc.$id,
          date: dayjs(doc.$createdAt).format("MMM D, YYYY"),
        }));
        // sort descending by createdAt
        loaded.sort((a, b) =>
          dayjs(b.date, "MMM D, YYYY").unix() - dayjs(a.date, "MMM D, YYYY").unix()
        );
        setEntries(loaded);
      } catch (err) {
        console.error("Failed to load check-ins:", err);
      }
    })();
  }, [userId]);

  // handle new check-in
  const handleCheckin = async () => {
    if (!userId || entries[0]?.date === todayStr) return;
    try {
      const created = await PhysicalGymCheckinsService.createCheckin({ userId });
      const newEntry = {
        id:   created.$id,
        date: dayjs(created.$createdAt).format("MMM D, YYYY"),
      };
      setEntries(prev => [newEntry, ...prev]);
    } catch (err) {
      console.error("Failed to create check-in:", err);
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
          {/* Button on left */}
          <div className="md:w-1/2">
            <button
              onClick={handleCheckin}
              disabled={entries[0]?.date === todayStr}
              className={`w-full py-2 rounded-xl transition font-medium
                ${entries[0]?.date === todayStr
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
                }`}
            >
              {entries[0]?.date === todayStr ? "Checked In ✓" : "Check In Today"}
            </button>
          </div>
          {/* History on right */}
          <div className="md:w-1/2">
            <ul className="max-h-64 overflow-auto space-y-2">
              {entries.length === 0 ? (
                <li className="text-gray-400">No check-ins logged yet.</li>
              ) : (
                entries.map(({ id, date }) => (
                  <li
                    key={id}
                    className="bg-gray-700/60 p-3 rounded-lg text-gray-200"
                  >
                    {date}
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
