// src/appwrite/physicalOtherService.js
import conf from "../conf/conf.js";
import { Client, Databases, ID, Query } from "appwrite";

class PhysicalOtherService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.db = new Databases(this.client);
  }

  /**
   * List all “other” activities for a user
   * @param {string} userId
   * @param {number} limit
   */
  async listActivities(userId, limit = 50) {
    return this.db.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwritePhysicalOtherCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]
    );
  }

  /**
   * Log an “other” activity
   * @param {{ userId: string, activityName: string, duration: number }} payload
   */
  async createActivity({ userId, activityName, duration }) {
    return this.db.createDocument(
      conf.appwriteDatabaseId,
      conf.appwritePhysicalOtherCollectionId,
      ID.unique(),
      { userId, activityName, duration }
    );
  }
}

export default new PhysicalOtherService();
