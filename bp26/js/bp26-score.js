// js/bp26-score.js
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp, 
  collection, 
  addDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { onAuthStateChanged } from "firebase/auth"
import { auth, db as playerCheckDb, leaderboardDb } from "../../auth/api/firebase-config.js";

const timestamp = Date.now();
const date = new Date(timestamp);
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const formattedDate = `${year}-${month}`

console.log("✅ Firebase connected to projectId:", leaderboardDb.app.options.projectId);
console.log("✅ Firebase connected to projectId:", playerCheckDb.app.options.projectId);

//let CURRENT_USER = "";
let CURRENT_UID = ""; 
let BP26_GAME = "bp26-Game1"; // default

function dayIdFromDate(d = new Date()) {
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
}

// Get player's uid from auth
// Leaderboard name will be reteived in realtime
onAuthStateChanged(auth, async (user) => {
  if (user) {
      try {
        CURRENT_UID = user.uid;
        //console.log("UID saved:", CURRENT_UID);
      } catch (error) {
        console.error("unable to get user uid:", error);
      }
    }
});

// function safeId(name) {
//   return (
//     name
//       .toLowerCase()
//       .trim()
//       .replace(/\s+/g, "_")
//       .replace(/[^a-z0-9_]/g, ""));
// }

// Create parent docs so they show in Firestore left panel (zat-am collection)
async function ensureParentsUnderZatAm() {
  await Promise.all([
    setDoc(doc(leaderboardDb, "zat-am", "Global"), { label: "Global", updatedAt: serverTimestamp() }, { merge: true }),
    setDoc(doc(leaderboardDb, "zat-am", "bp26"), { label: "bp26", updatedAt: serverTimestamp() }, { merge: true }),
    setDoc(doc(leaderboardDb, "zat-am", BP26_GAME), { label: BP26_GAME, updatedAt: serverTimestamp() }, { merge: true })
  ]);
}

export function bp26Init({ game } = {}) {
  if (game) BP26_GAME = String(game);
  console.log("✅ BP26 INIT:", {game: BP26_GAME });
}

// Upsert (and increment) player doc
// Update player's uid instead of name into the record
async function upsertIncrement(ref, uid, delta) {
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      //name,
      //uid,
      //playerName: name,
      playerUID: uid,
      score: increment(delta),      // leaderboard uses score
      lastScore: delta,
      updatedAt: serverTimestamp()  // leaderboard reads this for lastPlayed
    });
  } else {
    await setDoc(ref, {
      //name,
      //uid,
      //playerName: name,
      playerUID: uid,
      score: delta,                 // can be 0 ✅
      lastScore: delta,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
}

// Add a history record (like your screenshot: score, timestamp, uid)
async function addHistory(gameId, uid, score) {
  const entryKey = `${timestamp}_${uid}`
  const scoreNum = Number(score);
  console.log(entryKey)

  const batch = writeBatch(leaderboardDb);

  const dayId = dayIdFromDate(new Date());

  const historyDoc = doc(leaderboardDb, "zat-am", gameId, "gameHistory", formattedDate);
  const gameSeasonDoc = doc(leaderboardDb, "zat-am", gameId, "seasons", dayId, "gameHistory", formattedDate);
  const globalHistoryDoc = doc(leaderboardDb, "zat-am", "Global", "gameHistory", formattedDate);
  const globalSeasonDoc = doc(leaderboardDb, "zat-am", "Global", "seasons", dayId, "gameHistory", formattedDate);

  const updateData = {
    entries: {
      [entryKey]: scoreNum
    }
  };
  const options = { merge: true };

  batch.set(historyDoc, updateData, options);
  batch.set(gameSeasonDoc, updateData, options);
  batch.set(globalHistoryDoc, updateData, options);
  batch.set(globalSeasonDoc, updateData, options);

  try {
    await batch.commit();
    console.log("All history records updated successfully!");
  } catch (error) {
    console.error("Error updating history: ", error);
  }

}

export async function reportScore(score) {
  if (!CURRENT_UID ) {
    console.warn("⚠️ player uid not set yet, cannot report score.");
    return;
  }

  const s = Number(score);
  if (!Number.isFinite(s)) throw new Error("Score must be a number."); // 0 allowed ✅

  const uid = CURRENT_UID;
  //const id = safeId(CURRENT_USER);
  //const name = id;

  await ensureParentsUnderZatAm();

  // ✅ write history (so format matches Game1)
  await Promise.all([
    addHistory(BP26_GAME, uid, s),
    // addHistory("Global", uid, s), //merged into game score update
  ]);

  console.log("🔥 SCORE SAVED:", { game: BP26_GAME, user: uid, score: s });
  return { ok: true };
}

// expose for non-module usage too
window.bp26Init = bp26Init;
window.reportScore = reportScore;
