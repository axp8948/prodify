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
    appwriteGeneralTasksCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_GENERAL_TASKS_ID),
    appwriteGeneralNotesCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_GENERAL_NOTES_ID),
    appwriteGeneralRemindersCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_GENERAL_REMINDERS_ID),
    appwriteFinanceExpensesCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_FINANCE_EXPENSES_ID),
    appwriteFinanceIncomesCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_FINANCE_INCOMES_ID),
    appwritePhysicalGymCheckInsCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_PHYSICAL_GYM_CHECKIN_ID),
    appwritePhysicalGymDurationCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_PHYSICAL_GYM_DURATION_ID),
    appwritePhysicalStepsCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_PHYSICAL_STEPS_ID),
    appwritePhysicalOtherCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_PHYSICAL_OTHER_ID),


}


export default conf
