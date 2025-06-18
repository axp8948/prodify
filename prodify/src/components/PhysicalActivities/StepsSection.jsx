// src/components/PhysicalActivities/StepsSection.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Footprints } from "lucide-react";
import dayjs from "dayjs";
import PhysicalStepsService from "../../appwrite/physicalStepsServices";

export default function StepsSection() {
  const userData = useSelector((state) => state.auth.userData);
  const userId   = userData?.$id;

  const [history, setHistory] = useState([]); // { id, date, steps }
  const [steps,   setSteps]   = useState("");

  // load existing step entries
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await PhysicalStepsService.listSteps(userId, 50);
        const docs = res.documents || [];
        const loaded = docs.map((doc) => ({
          id:   doc.$id,
          date: dayjs(doc.$createdAt).format("MMM D, YYYY"),
          steps: doc.stepsCount,
        }));
        // sort newest first
        loaded.sort((a, b) =>
          dayjs(b.date, "MMM D, YYYY").unix() - dayjs(a.date, "MMM D, YYYY").unix()
        );
        setHistory(loaded);
      } catch (err) {
        console.error("Failed to load step history:", err);
      }
    })();
  }, [userId]);

  // handle new step log
  const handleLog = async () => {
    const count = parseInt(steps, 10);
    if (!userId || !count) return;
    try {
      const created = await PhysicalStepsService.createSteps({
        userId,
        stepsCount: count,
      });
      const entry = {
        id:    created.$id,
        date:  dayjs(created.$createdAt).format("MMM D, YYYY"),
        steps: created.stepsCount,
      };
      setHistory((prev) => [entry, ...prev]);
      setSteps("");
    } catch (err) {
      console.error("Failed to log steps:", err);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-sky-500 to-sky-700">
        <Footprints className="w-6 h-6 text-white" />
        <h2 className="text-white text-lg font-semibold">Steps</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form on left */}
          <div className="md:w-1/2 flex gap-3">
            <input
              type="number"
              min="0"
              placeholder="Steps"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={handleLog}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 transition text-white font-medium"
            >
              Log
            </button>
          </div>
          {/* History on right */}
          <div className="md:w-1/2">
            <ul className="max-h-64 overflow-auto space-y-2">
              {history.length === 0 ? (
                <li className="text-gray-400">No steps logged yet.</li>
              ) : (
                history.map((h) => (
                  <li
                    key={h.id}
                    className="flex justify-between bg-gray-700/60 p-3 rounded-lg text-gray-200"
                  >
                    <span>{h.date}</span>
                    <span className="font-semibold">{h.steps} steps</span>
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
