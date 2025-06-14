// src/pages/PhysicalActivities.jsx
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Footprints,
  Activity
} from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import GymCheckinSection from "../components/PhysicalActivities/GymCheckinSection";
import GymTimeSection   from "../components/PhysicalActivities/GymTimeSection";
import StepsSection     from "../components/PhysicalActivities/StepsSection";
import OtherActivitiesSection from "../components/PhysicalActivities/OtherActivitiesSection";
import dayjs from "dayjs";

export default function PhysicalActivities() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [overviewData, setOverviewData] = useState([]);

  // generate dummy 7-day data; swap in your real data here
  useEffect(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = dayjs().subtract(6 - i, "day");
      return {
        date: d.format("MMM D"),
        checkIn: Math.random() > 0.3 ? 1 : 0,
        hours: parseFloat((Math.random() * 2).toFixed(2)),
      };
    });
    setOverviewData(days);
  }, []);

  // config for the 4 sections
  const sections = [
    {
      key: "checkin",
      title: "Check-In",
      icon: MapPin,
      gradientClass: "bg-gradient-to-r from-amber-500 to-amber-700",
      value: "Log today",
      component: <GymCheckinSection />,
      tabIndex: 1,
    },
    {
      key: "time",
      title: "Duration",
      icon: Clock,
      gradientClass: "bg-gradient-to-r from-teal-500 to-teal-700",
      value: "0h 0m",
      component: <GymTimeSection />,
      tabIndex: 2,
    },
    {
      key: "steps",
      title: "Steps",
      icon: Footprints,
      gradientClass: "bg-gradient-to-r from-sky-500 to-sky-700",
      value: "0",
      component: <StepsSection />,
      tabIndex: 3,
    },
    {
      key: "other",
      title: "Other",
      icon: Activity,
      gradientClass: "bg-gradient-to-r from-fuchsia-500 to-fuchsia-700",
      value: "Add one",
      component: <OtherActivitiesSection />,
      tabIndex: 4,
    },
  ];

  const tabs = ["Overview", ...sections.map((s) => s.title)];

  return (
    <div className="min-h-screen bg-[#0d1013]">
      <main className="pt-24 px-6 pb-12 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Physical Activities
          </h1>
          <p className="mt-1 text-gray-400">
            Quickly jump to any tracker or view your week’s summary.
          </p>
        </header>

        {/* Section Summary Cards */}
        <div className="flex flex-wrap gap-4">
          {sections.map((sec) => (
            <SummaryCard
              key={sec.key}
              title={sec.title}
              value={sec.value}
              icon={sec.icon}
              gradientClass={sec.gradientClass}
              isActive={selectedTab === sec.tabIndex}
              onClick={() => setSelectedTab(sec.tabIndex)}
            />
          ))}
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-4 border-b border-gray-700">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(idx)}
              className={`pb-2 ${
                selectedTab === idx
                  ? "border-b-2 border-teal-400 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Chart */}
          {selectedTab === 0 && (
            <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={overviewData}>
                  <CartesianGrid stroke="#444" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis yAxisId="left" stroke="#888" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#888"
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="checkIn"
                    name="Check-Ins"
                    barSize={20}
                    fill="#82ca9d"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="hours"
                    name="Hours"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Individual Trackers */}
          {sections.map(
            (sec) =>
              selectedTab === sec.tabIndex && (
                <div key={sec.key}>{sec.component}</div>
              )
          )}
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  gradientClass,
  isActive,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        ${gradientClass}
        flex items-center gap-3 w-44 p-4 rounded-2xl shadow-lg transform transition
        text-white
        ${isActive ? "scale-105 shadow-2xl" : "hover:scale-105 hover:shadow-2xl"}
      `}
    >
      <Icon className="w-6 h-6" />
      <div className="text-left">
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </button>
  );
}
