// js/bp26-score.js
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp, 
  collection, 
  addDoc 
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth"
import { auth, db as playerCheckDb, leaderboardDb } from "../../auth/api/firebase-config.js";

console.log("✅ Firebase connected to projectId:", leaderboardDb.app.options.projectId);
console.log("✅ Firebase connected to projectId:", playerCheckDb.app.options.projectId);

//let CURRENT_USER = "";
let CURRENT_UID = ""; 
let BP26_GAME = "bp26-Game1"; // default

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
  const historyCol = collection(leaderboardDb, "zat-am", gameId, "gameHistory");
  await addDoc(historyCol, {
    //username: name,
    playerUID: uid,
    score: Number(score),
    timestamp: Date.now(),        
  });
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

  // ✅ refs
  const gamePlayerRef = doc(leaderboardDb, "zat-am", BP26_GAME, "players", uid);
  const bp26PlayerRef = doc(leaderboardDb, "zat-am", "bp26", "players", uid);
  const globPlayerRef = doc(leaderboardDb, "zat-am", "Global", "players", uid);

  // ✅ write players (so leaderboard shows it)
  await Promise.all([
    upsertIncrement(gamePlayerRef, uid, s),
    upsertIncrement(bp26PlayerRef, uid, s),
    upsertIncrement(globPlayerRef, uid, s)
  ]);

  // ✅ write history (so format matches Game1)
  await Promise.all([
    addHistory(BP26_GAME, uid, s),
    addHistory("Global", uid, s)
    // (optional) if you also want bp26 history:
    // addHistory("bp26", name, uid, s),
  ]);

  console.log("🔥 SCORE SAVED:", { game: BP26_GAME, user: uid, score: s });
  return { ok: true };
}

// expose for non-module usage too
window.bp26Init = bp26Init;
window.reportScore = reportScore;
