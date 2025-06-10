// src/components/TimeChart.jsx

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from "recharts";
import dayjs from "dayjs";

// Custom tooltip showing minutes per category and total
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const lecture = payload.find((p) => p.dataKey === "lecture")?.value || 0;
  const homework = payload.find((p) => p.dataKey === "homework")?.value || 0;
  const others = payload.find((p) => p.dataKey === "others")?.value || 0;
  const total = lecture + homework + others;

  return (
    <div
      style={{
        background: "#1f2937",
        padding: 12,
        borderRadius: 6,
        color: "#e5e7eb",
        fontSize: 14,
      }}
    >
      <strong>{dayjs(label).format("MMM D, YYYY")}</strong>
      <div style={{ marginTop: 8 }}>
        <div style={{ color: "#3b82f6" }}>● Lecture: {lecture.toFixed(0)}m</div>
        <div style={{ color: "#10b981" }}>● Homework: {homework.toFixed(0)}m</div>
        <div style={{ color: "#f59e0b" }}>● Others: {others.toFixed(0)}m</div>
        <hr style={{ borderColor: "#374151", margin: "6px 0" }} />
        <div style={{ fontWeight: "bold" }}>Total: {total.toFixed(0)}m</div>
      </div>
    </div>
  );
}

export default function TimeChart({ sessions }) {
  // 1) Aggregate into per-day, per-category (in minutes)
  const data = useMemo(() => {
    const map = {};
    sessions.forEach(({ date, category, seconds }) => {
      if (!map[date]) {
        map[date] = { date, lecture: 0, homework: 0, others: 0 };
      }
      // convert seconds → minutes
      map[date][category] += seconds / 60;
    });
    return Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [sessions]);

  // 2) Compute average total minutes per day
  const avgTotal = useMemo(() => {
    if (data.length === 0) return 0;
    const sum = data.reduce(
      (acc, { lecture, homework, others }) => acc + lecture + homework + others,
      0
    );
    return sum / data.length;
  }, [data]);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-semibold text-white mb-4">
        Time Spent per Day (minutes)
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
        >
          <defs>
            <linearGradient id="gradLecture" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="gradHomework" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="gradOthers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" stroke="#374151" />

          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            angle={-45}
            textAnchor="end"
            height={60}
            tickFormatter={(d) => dayjs(d).format("MM/DD")}
          />

          <YAxis
            stroke="#9CA3AF"
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            label={{
              value: "Minutes",
              angle: -90,
              position: "insideLeft",
              fill: "#9CA3AF",
              offset: -10,
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          <ReferenceLine
            y={avgTotal}
            stroke="#ef4444"
            strokeDasharray="3 3"
            label={{
              value: `Avg ${avgTotal.toFixed(0)}m`,
              position: "insideTopLeft",
              fill: "#ef4444",
              fontSize: 12,
            }}
          />

          <Bar
            dataKey="lecture"
            stackId="a"
            fill="url(#gradLecture)"
            name="Lecture"
            isAnimationActive
          >
            <LabelList
              dataKey="lecture"
              position="top"
              formatter={(v) => (v > 0 ? `${v.toFixed(0)}m` : "")}
            />
          </Bar>

          <Bar
            dataKey="homework"
            stackId="a"
            fill="url(#gradHomework)"
            name="Homework"
            isAnimationActive
          >
            <LabelList
              dataKey="homework"
              position="top"
              formatter={(v) => (v > 0 ? `${v.toFixed(0)}m` : "")}
            />
          </Bar>

          <Bar
            dataKey="others"
            stackId="a"
            fill="url(#gradOthers)"
            name="Others"
            isAnimationActive
          >
            <LabelList
              dataKey="others"
              position="top"
              formatter={(v) => (v > 0 ? `${v.toFixed(0)}m` : "")}
            />
          </Bar>

          <Legend
            verticalAlign="bottom"
            align="center"
            iconSize={16}
            wrapperStyle={{ paddingTop: 10, color: "#9CA3AF" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
