// src/services/ClassService.js

import conf from "../conf/conf.js";
import { Client, ID, Databases } from "appwrite";

export class ClassService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
  }

  /**
   * Adds a new Class document with fields: userId, className
   * @param {{ userId: string, className: string }} param0
   * @returns {Promise<object|null>}
   */


  async addClass({ userId, className }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,    // Your Appwrite database ID
        conf.appwriteClassesCollectionId,     // The “Class” collection ID
        ID.unique(),                // Let Appwrite generate a unique document ID
        {
          userId,
          className,
        }
      );
    } catch (error) {
      console.log("ClassService :: addClass :: error", error);
      return null;
    }
  }

    /**
   * Fetches all Class documents matching the provided queries.
   * @param {import("appwrite").Query[]} queries
   * @returns {Promise<import("appwrite").Models.DocumentList>} 
   */
  async getClasses(queries = []) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteClassesCollectionId,
        queries
      );
    } catch (error) {
      console.log("ClassService :: getClasses :: error", error);
      return { documents: [] };
    }
  }

    /**
   * Deletes a Class document by its document ID.
   * @param {string} documentId
   * @returns {Promise<boolean>}
   */
  async deleteClass(documentId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteClassesCollectionId,
        documentId
      );
      return true;
    } catch (error) {
      console.log("ClassService :: deleteClass :: error", error);
      return false;
    }
  }

}

const classService = new ClassService();
export default classService;
