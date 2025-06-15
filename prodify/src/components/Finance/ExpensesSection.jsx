// src/components/Finance/ExpensesSection.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "../ui/card";
import { CreditCard, ChevronDown, Edit2, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import ExpenseService from "../../appwrite/financeExpensesServices";

const expenseCategories = ["Food", "Bills", "Transport", "Entertainment", "Other"];

export default function ExpensesSection() {
  const userData = useSelector((state) => state.auth.userData);
  const userId   = userData?.$id;

  const [entries, setEntries]   = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount]     = useState("");

  // load existing expenses
  useEffect(() => {
    if (!userId){
      console.log("user id is required!")
      return;
    }
    (async () => {
      try {
        const res = await ExpenseService.listExpenses(userId, 100);
        const docs = res.documents;
        const loaded = docs.map(doc => ({
          id:       doc.$id,
          category: doc.category,
          amount:   doc.amount,
          date:     dayjs(doc.$createdAt).format("MMM D, YYYY"),
        }));
        setEntries(loaded);
      } catch (err) {
        console.error("Failed to load expenses:", err);
      }
    })();
  }, [userId]);

  // add new expense
  const handleAdd = async () => {
    if (!category || !amount || !userId) return;
    try {
      const created = await ExpenseService.createExpense({
        userId,
        category: category.toLowerCase(),
        amount:   parseFloat(amount),
      });
      const entry = {
        id:       created.$id,
        category: created.category,
        amount:   created.amount,
        date:     dayjs(created.$createdAt).format("MMM D, YYYY"),
      };
      setEntries(prev => [entry, ...prev]);
      setCategory("");
      setAmount("");
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  // update an existing expense
  const handleUpdate = async (id) => {
    const newAmt = prompt("New amount:", "");
    if (newAmt === null) return;
    try {
      const updated = await ExpenseService.updateExpense(id, {
        amount: parseFloat(newAmt)
      });
      setEntries(prev =>
        prev.map(e =>
          e.id === id
            ? { ...e, amount: updated.amount }
            : e
        )
      );
    } catch (err) {
      console.error("Failed to update expense:", err);
    }
  };

  // delete an expense
  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await ExpenseService.deleteExpense(id);
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-red-500 to-red-700">
        <CreditCard className="w-6 h-6 text-white" />
        <h2 className="text-white text-lg font-semibold">Log Expense</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form on left */}
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
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
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

          {/* Entries on right */}
          <div className="md:w-1/2">
            <ul className="max-h-64 overflow-auto space-y-2">
              {entries.length === 0 ? (
                <li className="text-gray-400">No expenses logged yet.</li>
              ) : (
                entries.map((e) => (
                  <li
                    key={e.id}
                    className="space-y-1 bg-gray-700/60 p-3 rounded-lg text-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {e.category.charAt(0).toUpperCase() + e.category.slice(1)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span>${e.amount.toFixed(2)}</span>
                        <Edit2
                          className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer"
                          onClick={() => handleUpdate(e.id)}
                        />
                        <Trash2
                          className="w-5 h-5 text-gray-300 hover:text-red-400 cursor-pointer"
                          onClick={() => handleDelete(e.id)}
                        />
                      </div>
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
