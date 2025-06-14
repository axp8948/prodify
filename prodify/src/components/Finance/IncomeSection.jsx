// src/components/Finance/IncomeSection.jsx
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { DollarSign } from "lucide-react";
import dayjs from "dayjs";

export default function IncomeSection() {
  const [entries, setEntries] = useState([]);
  const [source, setSource]   = useState("");
  const [amount, setAmount]   = useState("");

  const handleAdd = () => {
    if (!source || !amount) return;
    const date = dayjs().format("MMM D, YYYY");
    setEntries([{ date, source, amount: parseFloat(amount) }, ...entries]);
    setSource("");
    setAmount("");
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-700">
        <DollarSign className="w-6 h-6 text-white" />
        <h2 className="text-white text-lg font-semibold">Log Income</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* ← Form on left */}
          <div className="md:w-1/2 space-y-4">
            <input
              type="text"
              placeholder="Source (e.g. Salary)"
              value={source}
              onChange={e => setSource(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Amount ($)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={handleAdd}
              className="w-full py-2 rounded-xl bg-green-600 hover:bg-green-700 transition text-white font-medium"
            >
              Add Income
            </button>
          </div>

          {/* ← Entries on right */}
          <div className="md:w-1/2">
            <ul className="max-h-64 overflow-auto space-y-2">
              {entries.length === 0 && (
                <li className="text-gray-400">No income logged yet.</li>
              )}
              {entries.map((e, i) => (
                <li
                  key={i}
                  className="space-y-1 bg-gray-700/60 p-3 rounded-lg text-gray-200"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{e.source}</span>
                    <span>${e.amount.toFixed(2)}</span>
                  </div>
                  <div className="text-sm opacity-80">{e.date}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
);
}
