import React from "react";

export default function BudgetOverviewCard({ totalIncome, totalExpenses }) {
  const balance = totalIncome - totalExpenses;
  const spentPct = totalIncome > 0
    ? Math.min(Math.round((totalExpenses / totalIncome) * 100), 100)
    : 0;

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
