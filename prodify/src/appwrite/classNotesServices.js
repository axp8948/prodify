// appwrite/notesService.js

import conf from "../conf/conf.js";
import { Client, Databases, ID, Query } from "appwrite";

export class NotesService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
  }

  /** Create a new note */
  async createNote({ userId, classId, title, content }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteNotesCollectionId,
        ID.unique(),
        { userId, classId, title, content }
      );
    } catch (error) {
      console.error("NotesService :: createNote ::", error);
      return null;
    }
  }

  /** Fetch all notes for a given user & class */
  async listNotes(userId, classId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteNotesCollectionId,
        [
          Query.equal("userId", userId),
          Query.equal("classId", classId),
          Query.orderDesc("$createdAt"),
        ]
      );
    } catch (error) {
      console.error("NotesService :: listNotes ::", error);
      return { documents: [] };
    }
  }

  /** Update an existing note */
  async updateNote(noteId, { title, content }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteNotesCollectionId,
        noteId,
        { title, content }
      );
    } catch (error) {
      console.error("NotesService :: updateNote ::", error);
      return null;
    }
  }

  /** Delete a note */
  async deleteNote(noteId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteNotesCollectionId,
        noteId
      );
      return true;
    } catch (error) {
      console.error("NotesService :: deleteNote ::", error);
      return false;
    }
  }
}

const notesService = new NotesService();
export default notesService;
