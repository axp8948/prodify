const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteClassesCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_CLASSES_ID),
    appwriteNotesCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_CLASSNOTES_ID),
    appwriteReminderCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_CLASSREMINDERS_ID),
    appwriteSessionCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_CLASSSESSIONS_ID),
    appwriteSessionTotalCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_CLASSSESSIONSTOTAL_ID),
}


export default conf