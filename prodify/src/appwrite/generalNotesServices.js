// src/appwrite/generalNotesService.js

import conf from "../conf/conf.js";
import { Client, Databases, ID, Query } from "appwrite";

class GeneralNotesService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.db = new Databases(this.client);
  }

  async listNotes(userId, limit = 50) {
    return this.db.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralNotesCollectionId,
      [ Query.equal("userId", userId), Query.orderDesc("$createdAt"), Query.limit(limit) ]
    );
  }

  async createNote({ userId, text }) {
    return this.db.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralNotesCollectionId,
      ID.unique(),
      { userId, text}
    );
  }

  async deleteNote(noteId) {
    await this.db.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteGeneralNotesCollectionId,
      noteId
    );
    return true;
  }
}

export default new GeneralNotesService();
