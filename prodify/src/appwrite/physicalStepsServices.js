// src/appwrite/physicalStepsService.js
import conf from "../conf/conf.js";
import { Client, Databases, ID, Query } from "appwrite";

class PhysicalStepsService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.db = new Databases(this.client);
  }

  /**
   * List all step counts for a user
   * @param {string} userId
   * @param {number} limit
   */
  async listSteps(userId, limit = 50) {
    return this.db.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwritePhysicalStepsCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]
    );
  }

  /**
   * Record a new step count
   * @param {{ userId: string, stepsCount: number }} payload
   */
  async createSteps({ userId, stepsCount }) {
    return this.db.createDocument(
      conf.appwriteDatabaseId,
      conf.appwritePhysicalStepsCollectionId,
      ID.unique(),
      { userId, stepsCount }
    );
  }
}

export default new PhysicalStepsService();
