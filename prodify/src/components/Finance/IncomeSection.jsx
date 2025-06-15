// src/components/Finance/IncomeSection.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "../ui/card";
import { DollarSign, ChevronDown } from "lucide-react";
import dayjs from "dayjs";
import IncomeService from "../../appwrite/financeIncomesServices";

const incomeSources = ["Salary", "Freelance", "Investments", "Other"];

export default function IncomeSection() {
  // grab the Appwrite user object from Redux
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?.$id;

  const [entries, setEntries] = useState([]);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");

  // load existing incomes when we have a userId
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await IncomeService.listIncomes(userId, 100);
        const docs = res.documents;
        const loaded = docs.map((doc) => ({
          id: doc.$id,
          source: doc.category,
          amount: doc.amount,
          date: dayjs(doc.$createdAt).format("MMM D, YYYY"),
        }));
        setEntries(loaded);
      } catch (err) {
        console.error("Failed to load incomes:", err);
      }
    })();
  }, [userId]);

  // create new income
  const handleAdd = async () => {
    if (!source || !amount || !userId) {
      console.log("Source or Amount or userID required")
      console.log(userId)
      return;
    }
    try {
      const created = await IncomeService.createIncome({
        userId,
        category: source.toLowerCase(),
        amount: parseFloat(amount),
      });
      const entry = {
        id: created.$id,
        source: created.category,
        amount: created.amount,
        date: dayjs(created.$createdAt).format("MMM D, YYYY"),
      };
      setEntries((prev) => [entry, ...prev]);
      setSource("");
      setAmount("");
      console.log("Added income for user:", userId, source, amount);
    } catch (err) {
      console.error("Failed to add income:", err);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-700">
        <DollarSign className="w-6 h-6 text-white" />
        <h2 className="text-white text-lg font-semibold">Log Income</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form on left */}
          <div className="md:w-1/2 space-y-4">
            <div className="relative">
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="
                  appearance-none w-full px-4 py-2 rounded-xl 
                  bg-gray-700 text-white focus:outline-none 
                  focus:ring-2 focus:ring-green-400 hover:bg-gray-600 
                  transition pr-10
                "
              >
                <option value="" disabled>
                  Select income source
                </option>
                {incomeSources.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={20}
                className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Amount ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="
                w-full px-3 py-2 rounded-xl bg-gray-700 
                text-white placeholder-gray-400 focus:outline-none
                hover:bg-gray-600 transition
              "
            />
            <button
              onClick={handleAdd}
              className="
                w-full py-2 rounded-xl bg-green-600 
                hover:bg-green-700 transition text-white font-medium
              "
            >
              Add Income
            </button>
          </div>

          {/* Entries on right */}
          <div className="md:w-1/2">
            <ul className="max-h-64 overflow-auto space-y-2">
              {entries.length === 0 ? (
                <li className="text-gray-400">No income logged yet.</li>
              ) : (
                entries.map((e) => (
                  <li
                    key={e.id}
                    className="space-y-1 bg-gray-700/60 p-3 rounded-lg text-gray-200"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {e.source.charAt(0).toUpperCase() + e.source.slice(1)}
                      </span>
                      <span>${e.amount.toFixed(2)}</span>
                    </div>
                    <div className="text-sm opacity-80">{e.date}</div>
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
