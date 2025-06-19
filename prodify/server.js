// server.js
import "dotenv/config";
import express from "express";
import fetch from "node-fetch";                  // if Node 18+ you can omit and use global fetch
import { Client, Databases, Account, Query } from "appwrite";

const app = express();
app.use(express.json());

// ─── 1) ENV VARS ─────────────────────────────────────────────────────────────
const {
  VITE_APPWRITE_URL,
  VITE_APPWRITE_PROJECT_ID,
  GEMINI_API_KEY,
  VITE_APPWRITE_DATABASE_ID,

  VITE_APPWRITE_COLLECTION_CLASSSESSIONS_ID,
  VITE_APPWRITE_COLLECTION_CLASSSESSIONSTOTAL_ID,
  VITE_APPWRITE_COLLECTION_CLASSREMINDERS_ID,
  VITE_APPWRITE_COLLECTION_CLASSNOTES_ID,

  VITE_APPWRITE_COLLECTION_GENERAL_TASKS_ID,
  VITE_APPWRITE_COLLECTION_GENERAL_REMINDERS_ID,
  VITE_APPWRITE_COLLECTION_GENERAL_NOTES_ID,

  VITE_APPWRITE_COLLECTION_FINANCE_INCOMES_ID,
  VITE_APPWRITE_COLLECTION_FINANCE_EXPENSES_ID,

  VITE_APPWRITE_COLLECTION_PHYSICAL_STEPS_ID,
  VITE_APPWRITE_COLLECTION_PHYSICAL_GYM_DURATION_ID,
  VITE_APPWRITE_COLLECTION_PHYSICAL_GYM_CHECKIN_ID,
  VITE_APPWRITE_COLLECTION_PHYSICAL_OTHER_ID,
} = process.env;

if (
  !VITE_APPWRITE_URL ||
  !VITE_APPWRITE_PROJECT_ID ||
  !GEMINI_API_KEY ||
  !VITE_APPWRITE_DATABASE_ID
) {
  console.error("❌ Missing required .env variables");
  process.exit(1);
}

// ─── 2) MAP TO LOCAL CONSTS ──────────────────────────────────────────────────
const APPWRITE_ENDPOINT = VITE_APPWRITE_URL;
const APPWRITE_PROJECT = VITE_APPWRITE_PROJECT_ID;
const DB_ID = VITE_APPWRITE_DATABASE_ID;
const COLLECTION_CLASS_SESSIONS = VITE_APPWRITE_COLLECTION_CLASSSESSIONS_ID;
const COLLECTION_CLASS_REMINDERS = VITE_APPWRITE_COLLECTION_CLASSREMINDERS_ID;
const COLLECTION_CLASS_NOTES = VITE_APPWRITE_COLLECTION_CLASSNOTES_ID;
const COLLECTION_GENERAL_TASKS = VITE_APPWRITE_COLLECTION_GENERAL_TASKS_ID;
const COLLECTION_GENERAL_REMINDERS = VITE_APPWRITE_COLLECTION_GENERAL_REMINDERS_ID;
const COLLECTION_GENERAL_NOTES = VITE_APPWRITE_COLLECTION_GENERAL_NOTES_ID;
const COLLECTION_FINANCE_INCOMES = VITE_APPWRITE_COLLECTION_FINANCE_INCOMES_ID;
const COLLECTION_FINANCE_EXPENSES = VITE_APPWRITE_COLLECTION_FINANCE_EXPENSES_ID;
const COLLECTION_PHYSICAL_STEPS = VITE_APPWRITE_COLLECTION_PHYSICAL_STEPS_ID;
const COLLECTION_PHYSICAL_GYM_DURATION = VITE_APPWRITE_COLLECTION_PHYSICAL_GYM_DURATION_ID;
const COLLECTION_PHYSICAL_GYM_CHECKIN = VITE_APPWRITE_COLLECTION_PHYSICAL_GYM_CHECKIN_ID;
const COLLECTION_PHYSICAL_OTHER = VITE_APPWRITE_COLLECTION_PHYSICAL_OTHER_ID;
const COLLECTION_SESSIONS_TOTAL = VITE_APPWRITE_COLLECTION_CLASSSESSIONSTOTAL_ID

// ─── 3) INIT APWRITE SDK ──────────────────────────────────────────────────────
const awClient = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT);

const databases = new Databases(awClient);
const account = new Account(awClient);

// ─── 4) AUTH MIDDLEWARE ──────────────────────────────────────────────────────
async function authMiddleware(req, res, next) {
  try {
    const jwt = (req.headers.authorization || "").replace("Bearer ", "");
    if (!jwt) throw new Error("Missing Authorization header");
    awClient.setJWT(jwt);
    const user = await account.get();
    req.user = user; // { $id, email, ... }
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized", detail: err.message });
  }
}

//  ——— expose context once ———
app.get("/api/context", authMiddleware, async (req, res) => {
  try {
    const summary = await fetchUserContext(req.user.$id);
    res.json({ summary });
  } catch (err) {
    console.error("💥 /api/context error:", err);
    res.status(500).json({ error: err.message });
  }
});




async function fetchUserContext(userId) {
  // debug
  console.log("🏃‍♂️ fetchUserContext called for", userId);

  // Helper: fetch up to `limit` docs sorted by newest first
  const docs = async (colId, limit = 5) => {
    const res = await databases.listDocuments(DB_ID, colId, [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
    ]);
    return res.documents;
  };

  // 1) CLASS SESSIONS: sessionDate, totalTime, sessionType
  const classSessions = await docs(COLLECTION_CLASS_SESSIONS);
  const classSessionsList = classSessions.length
    ? classSessions.map(s => {
      const date = new Date(s.sessionDate).toLocaleDateString();
      return `- ${date}: ${s.totalTime} mins (${s.sessionType})`;
    }).join("\n")
    : "- (none)";

  // 2) CLASS REMINDERS: title, description, reminderAt, isCompleted
  const classRems = await docs(COLLECTION_CLASS_REMINDERS);
  const classRemsList = classRems.length
    ? classRems.map(r => {
      const due = new Date(r.reminderAt).toLocaleDateString();
      return `- ${r.isCompleted ? "✅" : "⏳"} ${r.title}: ${r.description || ""} (due ${due})`;
    }).join("\n")
    : "- (none)";

  // 3) CLASS NOTES: content
  const classNotes = await docs(COLLECTION_CLASS_NOTES);
  const classNotesList = classNotes.length
    ? classNotes.map(n => `- ${n.content || "(no content)"}`).join("\n")
    : "- (none)";

  // 4) GENERAL TASKS: text, isCompleted
  const generalTasks = await docs(COLLECTION_GENERAL_TASKS);
  const generalTasksList = generalTasks.length
    ? generalTasks.map(t => `- ${t.isCompleted ? "✅" : "❌"} ${t.text}`).join("\n")
    : "- (none)";

  // 5) GENERAL REMINDERS: title, description, dueAt, isDone
  const generalRems = await docs(COLLECTION_GENERAL_REMINDERS);
  const generalRemsList = generalRems.length
    ? generalRems.map(r => {
      const due = new Date(r.dueAt).toLocaleDateString();
      return `- ${r.isDone ? "✅" : "⏳"} ${r.title}: ${r.description || ""} (due ${due})`;
    }).join("\n")
    : "- (none)";

  // 6) GENERAL NOTES: text
  const generalNotes = await docs(COLLECTION_GENERAL_NOTES);
  const generalNotesList = generalNotes.length
    ? generalNotes.map(n => `- ${n.text}`).join("\n")
    : "- (none)";

  // 7) FINANCE INCOMES: category, amount
  const incomes = await docs(COLLECTION_FINANCE_INCOMES);
  const incomesList = incomes.length
    ? incomes.map(i => `- $${i.amount} (${i.category})`).join("\n")
    : "- (none)";

  // 8) FINANCE EXPENSES: category, amount
  const expenses = await docs(COLLECTION_FINANCE_EXPENSES);
  const expensesList = expenses.length
    ? expenses.map(e => `- $${e.amount} (${e.category})`).join("\n")
    : "- (none)";

  // 9) PHYSICAL STEPS: stepsCount
  const steps = await docs(COLLECTION_PHYSICAL_STEPS);
  const stepsList = steps.length
    ? steps.map(s => `- ${s.stepsCount} steps`).join("\n")
    : "- (none)";

  // 10) GYM DURATIONS: duration
  const gymDur = await docs(COLLECTION_PHYSICAL_GYM_DURATION);
  const gymDurList = gymDur.length
    ? gymDur.map(g => `- ${g.duration} mins`).join("\n")
    : "- (none)";

  // 11) GYM CHECK-INS: timestamp as date
  const gymChk = await docs(COLLECTION_PHYSICAL_GYM_CHECKIN);
  const gymChkList = gymChk.length
    ? gymChk.map(c => `- Checked in on ${new Date(c.$createdAt).toLocaleDateString()}`).join("\n")
    : "- (none)";

  // 12) OTHER ACTIVITIES: activityName, duration
  const other = await docs(COLLECTION_PHYSICAL_OTHER);
  const otherList = other.length
    ? other.map(o => `- ${o.activityName} for ${o.duration} mins`).join("\n")
    : "- (none)";

  // 13) SESSIONS TOTAL: lectureTotal, homeworkTotal, othersTotal
  const totals = await docs(COLLECTION_SESSIONS_TOTAL, 1);
  const t = totals[0] || {};
  const totalsList = totals.length
    ? [
      `- Lectures total: ${t.lectureTotal}`,
      `- Homework total: ${t.homeworkTotal}`,
      `- Other sessions total: ${t.othersTotal}`,
    ].join("\n")
    : "- (none)";

  // Combine into one context block
  return `
— CLASS SESSIONS (5 recent) —
${classSessionsList}

— CLASS REMINDERS (5 recent) —
${classRemsList}

— CLASS NOTES (5 recent) —
${classNotesList}

— GENERAL TASKS (5 recent) —
${generalTasksList}

— GENERAL REMINDERS (5 recent) —
${generalRemsList}

— GENERAL NOTES (5 recent) —
${generalNotesList}

— FINANCE INCOMES (5 recent) —
${incomesList}

— FINANCE EXPENSES (5 recent) —
${expensesList}

— PHYSICAL STEPS (5 recent) —
${stepsList}

— GYM DURATIONS (5 recent) —
${gymDurList}

— GYM CHECK-INS (5 recent) —
${gymChkList}

— OTHER ACTIVITIES (5 recent) —
${otherList}

— SESSIONS TOTAL —
${totalsList}
  `.trim();
}


// ─── 6) CHAT ENDPOINT ────────────────────────────────────────────────────────
app.post("/api/chat", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.$id;
    const question = (req.body.message || "").trim();
    if (!question) return res.status(400).json({ error: "No question provided" });

    // a) Build full context
    // prefer client‐cached summary if provided
    const summary = req.body.summary
      // ? req.body.summary
      // : await fetchUserContext(userId);
    console.log(summary);

    // b) Call Gemini
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
      contents: [{
        parts: [{
          text: [
            "You are Prodix, a friendly productivity assistant.",
            "Here is the user’s recent data:",
            summary,
            "User asks:",
            question
          ].join("\n\n")
        }]
      }]
    };

    const apiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await apiRes.json();
    console.log("📡 Gemini raw response:", JSON.stringify(json, null, 2));

    // c) Extract reply
    const candidate = json.candidates?.[0];
    const reply = candidate?.content?.parts?.[0]?.text
      || json.error?.message
      || "Sorry, I couldn’t generate a response.";

    res.json({ reply });
  } catch (err) {
    console.error("💥 /api/chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── 7) START ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Chat server listening on http://localhost:${PORT}`);
});
