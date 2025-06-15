// src/pages/Finance.jsx
import React, { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, CreditCard } from "lucide-react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

import IncomeSection from "../components/Finance/IncomeSection";
import ExpensesSection from "../components/Finance/ExpensesSection";
import IncomePieChart from "../components/Finance/IncomePieChart";
import ExpensePieChart from "../components/Finance/ExpensesPieChart";
import IncomeService from "../appwrite/financeIncomesServices";
import ExpenseService from "../appwrite/financeExpensesServices";

export default function Finance() {
  const userData = useSelector((state) => state.auth.userData);
  const userId   = userData?.$id;

  const [selectedTab, setSelectedTab]   = useState(0);
  const [overviewData, setOverviewData] = useState([]);
  const [incomeByCat, setIncomeByCat]   = useState([]);
  const [expenseByCat, setExpenseByCat] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const incRes = await IncomeService.listIncomes(userId, 1000);
        const expRes = await ExpenseService.listExpenses(userId, 1000);
        const incomes  = incRes.documents;
        const expenses = expRes.documents;

        // 7-day bar chart
        const days = Array.from({ length: 7 }).map((_, i) =>
          dayjs().subtract(6 - i, "day")
        );
        const ovData = days.map((d) => {
          const dateKey = d.format("MMM D");
          const income  = incomes
            .filter((doc) => dayjs(doc.$createdAt).isSame(d, "day"))
            .reduce((sum, doc) => sum + doc.amount, 0);
          const expense = expenses
            .filter((doc) => dayjs(doc.$createdAt).isSame(d, "day"))
            .reduce((sum, doc) => sum + doc.amount, 0);
          return { date: dateKey, income, expense };
        });
        setOverviewData(ovData);

        // aggregate by category
        const incMap = incomes.reduce((acc, d) => {
          acc[d.category] = (acc[d.category] || 0) + d.amount;
          return acc;
        }, {});
        const expMap = expenses.reduce((acc, d) => {
          acc[d.category] = (acc[d.category] || 0) + d.amount;
          return acc;
        }, {});

        setIncomeByCat(
          Object.entries(incMap).map(([name, value]) => ({ name, value }))
        );
        setExpenseByCat(
          Object.entries(expMap).map(([name, value]) => ({ name, value }))
        );
      } catch (err) {
        console.error("Failed to load finance data:", err);
      }
    };

    fetchData();
  }, [userId]);

  const sections = [
    {
      key:          "income",
      title:        "Income",
      icon:         DollarSign,
      gradientClass:"bg-gradient-to-r from-green-500 to-green-700",
      component:    <IncomeSection />,
      tabIndex:     1,
    },
    {
      key:          "expenses",
      title:        "Expenses",
      icon:         CreditCard,
      gradientClass:"bg-gradient-to-r from-red-500 to-red-700",
      component:    <ExpensesSection />,
      tabIndex:     2,
    },
  ];

  const tabs = ["Overview", ...sections.map((s) => s.title)];

  return (
    <div className="min-h-screen bg-[#0d1013]">
      <main className="pt-24 px-6 pb-12 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Finance
          </h1>
          <p className="mt-1 text-gray-400">
            Track your income and expenses over time.
          </p>
        </header>

        {/* Summary Cards */}
        <div className="flex flex-wrap gap-4">
          {sections.map((sec) => (
            <SummaryCard
              key={sec.key}
              title={sec.title}
              value={
                sec.key === "income"
                  ? `$${overviewData.reduce((s, d) => s + d.income, 0).toFixed(2)}`
                  : `$${overviewData.reduce((s, d) => s + d.expense, 0).toFixed(2)}`
              }
              icon={sec.icon}
              gradientClass={sec.gradientClass}
              isActive={selectedTab === sec.tabIndex}
              onClick={() => setSelectedTab(sec.tabIndex)}
            />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-700">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(idx)}
              className={`pb-2 ${
                selectedTab === idx
                  ? "border-b-2 border-green-400 text-white"
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
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={overviewData}>
                    <CartesianGrid stroke="#444" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="income"
                      name="Income"
                      fill="#22c55e"
                      barSize={20}
                    />
                    <Bar
                      dataKey="expense"
                      name="Expenses"
                      fill="#ef4444"
                      barSize={20}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <IncomePieChart data={incomeByCat} />
                <ExpensePieChart data={expenseByCat} />
              </div>
            </div>
          )}

          {/* Income / Expense Sections */}
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
