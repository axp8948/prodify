// src/components/Finance/ExpensesSection.jsx
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { CreditCard, ChevronDown } from "lucide-react";
import dayjs from "dayjs";

const expenseCategories = ["Food", "Bills", "Transport", "Entertainment", "Other"];

export default function ExpensesSection() {
  const [entries, setEntries]   = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount]     = useState("");

  const handleAdd = () => {
    if (!category || !amount) return;
    const date = dayjs().format("MMM D, YYYY");
    setEntries([{ date, category, amount: parseFloat(amount) }, ...entries]);
    setCategory("");
    setAmount("");
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-red-500 to-red-700">
        <CreditCard className="w-6 h-6 text-white" />
        <h2 className="text-white text-lg font-semibold">Log Expense</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* ← Form on left */}
          <div className="md:w-1/2 space-y-4">
            <div className="relative">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="
                  appearance-none w-full px-4 py-2 rounded-xl 
                  bg-gray-700 text-white focus:outline-none 
                  focus:ring-2 focus:ring-red-400 hover:bg-gray-600 
                  transition pr-10
                "
              >
                <option value="" disabled>
                  Select expense category
                </option>
                {expenseCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="pointer-events-none absolute right-3 top-1/2 
                           transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Amount ($)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="
                w-full px-3 py-2 rounded-xl bg-gray-700 
                text-white placeholder-gray-400 focus:outline-none
                hover:bg-gray-600 transition
              "
            />
            <button
              onClick={handleAdd}
              className="
                w-full py-2 rounded-xl bg-red-600 
                hover:bg-red-700 transition text-white font-medium
              "
            >
              Add Expense
            </button>
          </div>

          {/* ← Entries on right */}
          <div className="md:w-1/2">
            <ul className="max-h-64 overflow-auto space-y-2">
              {entries.length === 0 && (
                <li className="text-gray-400">No expenses logged yet.</li>
              )}
              {entries.map((e, i) => (
                <li
                  key={i}
                  className="space-y-1 bg-gray-700/60 p-3 rounded-lg text-gray-200"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{e.category}</span>
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
