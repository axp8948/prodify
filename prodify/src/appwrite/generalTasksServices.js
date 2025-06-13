// src/appwrite/generalTasksService.js

import conf from "../conf/conf.js";
import { Client, Databases, ID, Query } from "appwrite";

class GeneralTasksService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.db = new Databases(this.client);
  }

  // Fetch up to `limit` tasks for a user
  async listTasks(userId, limit = 50) {
    return this.db.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralTasksCollectionId,
      [ Query.equal("userId", userId), Query.orderDesc("$createdAt"),, Query.limit(limit) ]
    );
  }

  // Create a new task
  async createTask({ userId, text }) {
    return this.db.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralTasksCollectionId,
      ID.unique(),
      { userId, text, isCompleted: false }
    );
  }

  // Toggle or update a task
  async updateTask(taskId, data) {
    return this.db.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralTasksCollectionId,
      taskId,
      data
    );
  }

  // Delete a task
  async deleteTask(taskId) {
    await this.db.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralTasksCollectionId,
      taskId
    );
    return true;
  }
}

export default new GeneralTasksService();
