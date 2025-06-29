// src/appwrite/generalRemindersService.js

import conf from "../conf/conf.js";
import { Client, Databases, ID, Query } from "appwrite";

class GeneralRemindersService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.db = new Databases(this.client);
  }

  /**
   * Fetch up to `limit` general reminders for this user, ordered by due date.
   * Ensures `limit` is always a valid positive integer (defaults to 50).
   */
  async listReminders(userId, limit = 50) {
    // Coerce and validate limit
    let numLimit = parseInt(limit, 10);
    if (Number.isNaN(numLimit) || numLimit <= 0) {
      numLimit = 50;
    }

    return this.db.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralRemindersCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderAsc("dueAt"),
        Query.limit(numLimit),
      ]
    );
  }

  async createReminder({ userId, title, description, dueAt }) {
    return this.db.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralRemindersCollectionId,
      ID.unique(),
      { userId, title, description, dueAt, isDone: false }
    );
  }

  async updateReminder(reminderId, data) {
    return this.db.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralRemindersCollectionId,
      reminderId,
      data
    );
  }

  async deleteReminder(reminderId) {
    await this.db.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralRemindersCollectionId,
      reminderId
    );
    return true;
  }
}

export default new GeneralRemindersService();
