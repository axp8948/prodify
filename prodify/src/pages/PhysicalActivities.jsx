// src/pages/PhysicalActivities.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  MapPin,
  Clock,
  Footprints,
  Activity,
  Target,
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
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

import GymCheckinSection from "../components/PhysicalActivities/GymCheckinSection";
import GymTimeSection from "../components/PhysicalActivities/GymTimeSection";
import StepsSection from "../components/PhysicalActivities/StepsSection";
import OtherActivitiesSection from "../components/PhysicalActivities/OtherActivitiesSection";
import GoalsSection from "../components/PhysicalActivities/GoalsSection";

import PhysicalGymCheckinsService from "../appwrite/physicalGymCheckInsServices";
import PhysicalGymDurationService from "../appwrite/physicalGymDurationServices";
import PhysicalStepsService from "../appwrite/physicalStepsServices";
import PhysicalOtherService from "../appwrite/physicalOtherServices";

export default function PhysicalActivities() {
  const userData = useSelector((state) => state.auth.userData);
  const userId   = userData?.$id;

  const [selectedTab, setSelectedTab]   = useState(0);
  const [overviewData, setOverviewData] = useState([]);
  const [checkins, setCheckins]         = useState([]);
  const [durations, setDurations]       = useState([]);
  const [steps, setSteps]               = useState([]);
  const [others, setOthers]             = useState([]);

  // static goals – you'd load these from persistence in a real app
  const goals = {
    checkin: 5,    // days/week
    duration: 300, // minutes/week
    steps: 10000,  // steps/day
  };

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const [ciRes, duRes, stRes, otRes] = await Promise.all([
          PhysicalGymCheckinsService.listCheckins(userId, 1000),
          PhysicalGymDurationService.listDurations(userId, 1000),
          PhysicalStepsService.listSteps(userId, 1000),
          PhysicalOtherService.listActivities(userId, 1000),
        ]);

        const ciDocs = ciRes.documents || [];
        const duDocs = duRes.documents || [];
        const stDocs = stRes.documents || [];
        const otDocs = otRes.documents || [];

        setCheckins(ciDocs);
        setDurations(duDocs);
        setSteps(stDocs);
        setOthers(otDocs);

        // build last-7-days overview
        const days = Array.from({ length: 7 }).map((_, i) =>
          dayjs().subtract(6 - i, "day")
        );
        const data = days.map((d) => {
          const dateKey = d.format("MMM D");
          const checkIn = ciDocs.some(doc =>
            dayjs(doc.$createdAt).isSame(d, "day")
          ) ? 1 : 0;
          const totalMins = duDocs
            .filter(doc => dayjs(doc.$createdAt).isSame(d, "day"))
            .reduce((sum, doc) => sum + doc.duration, 0);
          const hours = Math.round((totalMins / 60) * 100) / 100;
          return { date: dateKey, checkIn, hours };
        });
        setOverviewData(data);
      } catch (err) {
        console.error("Failed to load physical activities:", err);
      }
    })();
  }, [userId]);

  // compute totals for progress bars
  const totalCheckins = overviewData.reduce((sum, d) => sum + d.checkIn, 0);
  const weekStart     = dayjs().subtract(6, "day");
  const totalMinsWeek = durations
    .filter(doc => dayjs(doc.$createdAt).isAfter(weekStart, "day"))
    .reduce((sum, doc) => sum + doc.duration, 0);
  const totalStepsDay = steps
    .filter(doc => dayjs(doc.$createdAt).isSame(dayjs(), "day"))
    .reduce((sum, doc) => sum + doc.stepsCount, 0);

  // progress bar component
  const ProgressBar = ({ label, done, goal, colorClass }) => {
    const pct = goal > 0 ? Math.min(Math.round((done / goal) * 100), 100) : 0;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-white">
          <span>{label}</span>
          <span>
            {done}/{goal} ({pct}%)
          </span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded">
          <div
            className={`${colorClass} h-full rounded transition-width`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  // sections array including Goals as first card
  const sections = [
    {
      key: "goals",
      title: "Goals",
      icon: Target,
      gradientClass: "bg-gradient-to-r from-zinc-500 to-zinc-800",
      value: "Set Goals",
      component: <GoalsSection />,
      tabIndex: 1,
    },
    {
      key: "checkin",
      title: "Check-Ins",
      icon: MapPin,
      gradientClass: "bg-gradient-to-r from-amber-500 to-amber-800",
      value: `${totalCheckins} day${totalCheckins !== 1 ? "s" : ""}`,
      component: <GymCheckinSection />,
      tabIndex: 2,
    },
    {
      key: "time",
      title: "Duration",
      icon: Clock,
      gradientClass: "bg-gradient-to-r from-teal-500 to-teal-800",
      value: `${Math.floor(totalMinsWeek/60)}h ${totalMinsWeek%60}m`,
      component: <GymTimeSection />,
      tabIndex: 3,
    },
    {
      key: "steps",
      title: "Steps",
      icon: Footprints,
      gradientClass: "bg-gradient-to-r from-sky-500 to-sky-800",
      value: `${totalStepsDay} steps`,
      component: <StepsSection />,
      tabIndex: 4,
    },
    {
      key: "other",
      title: "Other",
      icon: Activity,
      gradientClass: "bg-gradient-to-r from-emerald-500 to-emerald-800",
      value: `${others.length} act${others.length !== 1 ? "s" : ""}`,
      component: <OtherActivitiesSection />,
      tabIndex: 5,
    },
  ];

  // tabs labels for navigation
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

        {/* Summary Cards */}
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

        {/* Content */}
        <div className="space-y-6">
          {/* Overview */}
          {selectedTab === 0 && (
            <>
              {/* 7-day chart */}
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
              {/* Progress Toward Goals */}
              <div className="bg-gray-800/50 p-6 rounded-2xl space-y-4">
                <h2 className="text-white text-lg font-semibold">
                  Progress Toward Your Goals
                </h2>
                <ProgressBar
                  label="Check-Ins /wk"
                  done={totalCheckins}
                  goal={goals.checkin}
                  colorClass="bg-amber-400"
                />
                <ProgressBar
                  label="Minutes /wk"
                  done={totalMinsWeek}
                  goal={goals.duration}
                  colorClass="bg-teal-400"
                />
                <ProgressBar
                  label="Steps /day"
                  done={totalStepsDay}
                  goal={goals.steps}
                  colorClass="bg-sky-400"
                />
              </div>
            </>
          )}

          {/* Goals */}
          {selectedTab === 1 && <GoalsSection />}

          {/* Other Sections */}
          {selectedTab > 1 &&
            sections
              .find((s) => s.tabIndex === selectedTab)
              .component}
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
        flex items-center gap-3 w-44 p-4 rounded-2xl shadow-lg
        transform transition text-white
        ${isActive
          ? "scale-105 shadow-2xl"
          : "hover:scale-105 hover:shadow-2xl"}
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
