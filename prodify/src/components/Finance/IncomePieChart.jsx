// src/components/Finance/IncomePieChart.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#10b981", "#a3e635", "#84cc16", "#65a30d"];

export default function IncomePieChart({ data }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-md p-4 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-2">Income by Category</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val) => [`$${val.toFixed(2)}`, "Income"]}
            contentStyle={{ backgroundColor: "#333", border: "none" }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ color: "#ccc", fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
