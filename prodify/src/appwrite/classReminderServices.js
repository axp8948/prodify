// appwrite/remindersService.js

import conf from "../conf/conf.js";
import { Client, Databases, ID, Query } from "appwrite";

export class RemindersService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
  }

  /**
   * Creates a new Reminder document.
   * @param {{ userId: string, classId: string, title: string, description: string, reminderAt: string, isCompleted: boolean }} params
   * @returns {Promise<import("appwrite").Models.Document|null>}
   */
  async createReminder({ userId, classId, title, description, reminderAt, isCompleted = false }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteReminderCollectionId,
        ID.unique(),
        { userId, classId, title, description, reminderAt, isCompleted }
      );
    } catch (error) {
      console.error("RemindersService :: createReminder :: error", error);
      return null;
    }
  }

  /**
   * Fetches all reminders for a given user & class, ordered by reminderAt descending.
   * @param {string} userId
   * @param {string} classId
   * @returns {Promise<import("appwrite").Models.DocumentList>}
   */
  async listReminders(userId, classId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteReminderCollectionId,
        [
          Query.equal("userId", userId),
          Query.equal("classId", classId),
          Query.orderDesc("reminderAt"),
        ]
      );
    } catch (error) {
      console.error("RemindersService :: listReminders :: error", error);
      return { documents: [] };
    }
  }

  /**
   * Updates an existing Reminder document.
   * @param {string} reminderId
   * @param {{ title?: string, description?: string, reminderAt?: string, isCompleted?: boolean }} params
   * @returns {Promise<import("appwrite").Models.Document|null>}
   */
  async updateReminder(reminderId, { title, description, reminderAt, isCompleted }) {
    try {
      const data = {};
      if (title !== undefined)       data.title = title;
      if (description !== undefined) data.description = description;
      if (reminderAt !== undefined)  data.reminderAt = reminderAt;
      if (isCompleted !== undefined) data.isCompleted = isCompleted;

      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteReminderCollectionId,
        reminderId,
        data
      );
    } catch (error) {
      console.error("RemindersService :: updateReminder :: error", error);
      return null;
    }
  }

  /**
   * Deletes a Reminder document by its ID.
   * @param {string} reminderId
   * @returns {Promise<boolean>}
   */
  async deleteReminder(reminderId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteReminderCollectionId,
        reminderId
      );
      return true;
    } catch (error) {
      console.error("RemindersService :: deleteReminder :: error", error);
      return false;
    }
  }
}

const remindersService = new RemindersService();
export default remindersService;
