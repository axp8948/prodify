// appwrite/sessionsService.js

import conf from "../conf/conf.js";
import { Client, Databases, ID, Query } from "appwrite";

export class SessionsService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
  }

  // ─── ClassSessions: track each individual session ────────────────────────

  /**
   * Create a new class session record.
   * @param {{ userId: string, classId: string, sessionDate: string, totalTime: number, sessionType: string }} params
   * @returns {Promise<import("appwrite").Models.Document|null>}
   */
  async createClassSession({ userId, classId, sessionDate, totalTime, sessionType }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteSessionCollectionId,
        ID.unique(),
        { userId, classId, sessionDate, totalTime, sessionType }
      );
    } catch (error) {
      console.error("SessionsService :: createClassSession ::", error);
      return null;
    }
  }

  /**
   * List all class session records for a given user & class.
   * @param {string} userId
   * @param {string} classId
   * @returns {Promise<import("appwrite").Models.DocumentList>}
   */
  async listClassSessions(userId, classId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteSessionCollectionId,
        [
          Query.equal("userId", userId),
          Query.equal("classId", classId),
          Query.orderDesc("sessionDate"),
        ]
      );
    } catch (error) {
      console.error("SessionsService :: listClassSessions ::", error);
      return { documents: [] };
    }
  }

  /**
   * Update an existing class session.
   * @param {string} sessionId
   * @param {{ sessionDate?: string, totalTime?: number, sessionType?: string }} params
   * @returns {Promise<import("appwrite").Models.Document|null>}
   */
  async updateClassSession(sessionId, { sessionDate, totalTime, sessionType }) {
    try {
      const data = {};
      if (sessionDate   !== undefined) data.sessionDate   = sessionDate;
      if (totalTime     !== undefined) data.totalTime     = totalTime;
      if (sessionType   !== undefined) data.sessionType   = sessionType;

      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteSessionCollectionId,
        sessionId,
        data
      );
    } catch (error) {
      console.error("SessionsService :: updateClassSession ::", error);
      return null;
    }
  }

  /**
   * Delete a class session record.
   * @param {string} sessionId
   * @returns {Promise<boolean>}
   */
  async deleteClassSession(sessionId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteSessionCollectionId,
        sessionId
      );
      return true;
    } catch (error) {
      console.error("SessionsService :: deleteClassSession ::", error);
      return false;
    }
  }

  // ─── SessionTotals: keep aggregate totals per class ──────────────────────

  /**
   * Fetch the session totals document for a given user & class.
   * @param {string} userId
   * @param {string} classId
   * @returns {Promise<import("appwrite").Models.DocumentList>}
   */
  async getSessionTotal(userId, classId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteSessionTotalCollectionId,
        [
          Query.equal("userId", userId),
          Query.equal("classId", classId),
        ]
      );
    } catch (error) {
      console.error("SessionsService :: getSessionTotal ::", error);
      return { documents: [] };
    }
  }

  /**
   * Create a new session totals record.
   * @param {{ userId: string, classId: string, lectureTotal: number, homeworkTotal: number, othersTotal: number }} params
   * @returns {Promise<import("appwrite").Models.Document|null>}
   */
  async createSessionTotal({ userId, classId, lectureTotal, homeworkTotal, othersTotal }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteSessionTotalCollectionId,
        ID.unique(),
        { userId, classId, lectureTotal, homeworkTotal, othersTotal }
      );
    } catch (error) {
      console.error("SessionsService :: createSessionTotal ::", error);
      return null;
    }
  }

  /**
   * Update an existing session totals record.
   * @param {string} totalId
   * @param {{ lectureTotal?: number, homeworkTotal?: number, othersTotal?: number }} params
   * @returns {Promise<import("appwrite").Models.Document|null>}
   */
  async updateSessionTotal(totalId, { lectureTotal, homeworkTotal, othersTotal }) {
    try {
      const data = {};
      if (lectureTotal  !== undefined) data.lectureTotal  = lectureTotal;
      if (homeworkTotal !== undefined) data.homeworkTotal = homeworkTotal;
      if (othersTotal   !== undefined) data.othersTotal   = othersTotal;

      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteSessionTotalCollectionId,
        totalId,
        data
      );
    } catch (error) {
      console.error("SessionsService :: updateSessionTotal ::", error);
      return null;
    }
  }

  // in appwrite/sessionsService.js

  /**
   * List all class session records for a given user.
   * (No classId filter)
   */
  async listAllSessions(userId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteSessionCollectionId,
        [
          Query.equal("userId", userId),
          Query.orderDesc("sessionDate"),
        ]
      );
    } catch (error) {
      console.error("SessionsService :: listAllSessions ::", error);
      return { documents: [] };
    }
  }

}

const sessionsService = new SessionsService();
export default sessionsService;
