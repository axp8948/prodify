// src/appwrite/incomeService.js

import conf from "../conf/conf.js";
import { Client, Databases, ID, Query } from "appwrite";

class IncomeService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.db = new Databases(this.client);
  }

  /**
   * List recent incomes for a user
   * @param {string} userId
   * @param {number} limit
   */
  async listIncomes(userId, limit = 50) {
    return this.db.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteFinanceIncomesCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]
    );
  }

  /**
   * Create a new income record
   * @param {{ userId: string, category: string, amount: number }} income
   */
  async createIncome({ userId, category, amount }) {
    return this.db.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteFinanceIncomesCollectionId,
      ID.unique(),
      { userId, category, amount }
    );
  }

  /**
   * Delete an income record by its document ID
   * @param {string} incomeId
   */
  async deleteIncome(incomeId) {
    await this.db.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteFinanceIncomesCollectionId,
      incomeId
    );
    return true;
  }

  /**
   * (Optional) Update an existing income entry
   * @param {string} incomeId
   * @param {{ category?: string, amount?: number }} updates
   */
  async updateIncome(incomeId, updates) {
    return this.db.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteFinanceIncomesCollectionId,
      incomeId,
      updates
    );
  }
}

export default new IncomeService();
