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

  async listReminders(userId, limit = 50) {
    return this.db.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralRemindersCollectionId,
      [ Query.equal("userId", userId), Query.orderAsc("dueAt"), Query.limit(limit) ]
    );
  }

  async createReminder({ userId, title, description, dueAt }) {
    return this.db.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralRemindersCollectionId,
      ID.unique(),
      { userId, title, description, dueAt, isDone: false, }
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
