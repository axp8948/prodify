// src/components/Finance/BudgetOverviewCard.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import IncomeService from "../../appwrite/incomeService";
import ExpenseService from "../../appwrite/financeExpenseServices";

export default function BudgetOverviewCard() {
  const userData = useSelector((state) => state.auth.userData);
  const userId   = userData?.$id;

  const [totalIncome, setTotalIncome]     = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchTotals = async () => {
      setLoading(true);
      try {
        // fetch all incomes
        const incRes = await IncomeService.listIncomes(userId, 1000);
        const incomes = incRes.documents.map(d => d.amount);
        const incomeSum = incomes.reduce((sum, amt) => sum + amt, 0);

        // fetch all expenses
        const expRes = await ExpenseService.listExpenses(userId, 1000);
        const expenses = expRes.documents.map(d => d.amount);
        const expenseSum = expenses.reduce((sum, amt) => sum + amt, 0);

        setTotalIncome(incomeSum);
        setTotalExpenses(expenseSum);
      } catch (err) {
        console.error("Failed to load budget totals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, [userId]);

  const balance = totalIncome - totalExpenses;
  const spentPct = totalIncome > 0
    ? Math.min(Math.round((totalExpenses / totalIncome) * 100), 100)
    : 0;

  if (loading) {
    return (
      <div className="w-full sm:w-[340px] bg-white/20 dark:bg-zinc-900/20 rounded-2xl shadow-lg p-6 flex items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-[340px] bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
        Budget Overview
      </h2>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Income</p>
          <p className="text-lg font-bold text-green-600">
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Expenses</p>
          <p className="text-lg font-bold text-red-600">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Balance</p>
        <p
          className={`text-lg font-semibold ${
            balance >= 0 ? "text-blue-600" : "text-red-600"
          }`}
        >
          ${balance.toFixed(2)}
        </p>
      </div>

      {/* Spending Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>Spent</span>
          <span>{spentPct}%</span>
        </div>
        <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 transition-width duration-500"
            style={{ width: `${spentPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
