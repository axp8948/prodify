// src/appwrite/financeExpenseServices.js

import conf from "../conf/conf.js";
import { Client, Databases, ID, Query } from "appwrite";

class ExpenseService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.db = new Databases(this.client);
  }

  /**
   * List recent expenses for a user
   * @param {string} userId
   * @param {number} limit
   */
  async listExpenses(userId, limit = 50) {
    return this.db.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteFinanceExpensesCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]
    );
  }

  /**
   * Create a new expense record
   * @param {{ userId: string, category: string, amount: number }} expense
   */
  async createExpense({ userId, category, amount }) {
    return this.db.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteFinanceExpensesCollectionId,
      ID.unique(),
      { userId, category, amount }
    );
  }

  /**
   * Delete an expense record by its document ID
   * @param {string} expenseId
   */
  async deleteExpense(expenseId) {
    await this.db.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteFinanceExpensesCollectionId,
      expenseId
    );
    return true;
  }

  /**
   * Update an existing expense entry
   * @param {string} expenseId
   * @param {{ category?: string, amount?: number }} updates
   */
  async updateExpense(expenseId, updates) {
    return this.db.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteFinanceExpensesCollectionId,
      expenseId,
      updates
    );
  }
}

export default new ExpenseService();
