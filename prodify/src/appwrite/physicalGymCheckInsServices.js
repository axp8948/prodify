// src/appwrite/physicalGymCheckinsService.js
import conf from "../conf/conf.js";
import { Client, Databases, ID, Query } from "appwrite";

class PhysicalGymCheckinsService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.db = new Databases(this.client);
  }

  /**
   * List all check-ins for a user
   * @param {string} userId
   * @param {number} limit
   */
  async listCheckins(userId, limit = 50) {
    return this.db.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwritePhysicalGymCheckInsCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]
    );
  }

  /**
   * Create a check-in (uses Appwrite’s $createdAt timestamp)
   * @param {{ userId: string }} payload
   */
  async createCheckin({ userId }) {
    return this.db.createDocument(
      conf.appwriteDatabaseId,
      conf.appwritePhysicalGymCheckInsCollectionId,
      ID.unique(),
      { userId }
    );
  }
}

export default new PhysicalGymCheckinsService();
