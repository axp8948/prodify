// src/appwrite/physicalGymDurationService.js
import conf from "../conf/conf.js";
import { Client, Databases, ID, Query } from "appwrite";

class PhysicalGymDurationService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.db = new Databases(this.client);
  }

  /**
   * List all session durations for a user
   * @param {string} userId
   * @param {number} limit
   */
  async listDurations(userId, limit = 50) {
    return this.db.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwritePhysicalGymDurationCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]
    );
  }

  /**
   * Log a new gym session duration
   * @param {{ userId: string, duration: number }} payload
   */
  async createDuration({ userId, duration }) {
    return this.db.createDocument(
      conf.appwriteDatabaseId,
      conf.appwritePhysicalGymDurationCollectionId,
      ID.unique(),
      { userId, duration }
    );
  }
}

export default new PhysicalGymDurationService();
