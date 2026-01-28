// js/bp26-score.js
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
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
import { auth, db as playerCheckDb, leaderboardDb } from "./auth/api/firebase-config.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyAwqOOawElTcsBIAmJQIkZYs-W-h8kJx7A",
//   authDomain: "temporary-db-e9ace.firebaseapp.com",
//   databaseURL: "https://temporary-db-e9ace-default-rtdb.firebaseio.com",
//   projectId: "temporary-db-e9ace",
//   storageBucket: "temporary-db-e9ace.firebasestorage.app",
//   messagingSenderId: "810939107125",
//   appId: "1:810939107125:web:25edc649d354c1ca0bee7c"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

console.log("✅ Firebase connected to projectId:", leaderboardDb.options.projectId);
console.log("✅ Firebase connected to projectId:", playerCheckDb.options.projectId);

let CURRENT_USER = "";
let BP26_GAME = "bp26-Game1"; // default

function safeId(name) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "") || "guest"
  );
}

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
// Update player's uid into the record
async function upsertIncrement(ref, name, uid, delta) {
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      name,
      uid,
      playerName: name,
      playerUID: uid,
      score: increment(delta),      // leaderboard uses score
      lastScore: delta,
      updatedAt: serverTimestamp()  // leaderboard reads this for lastPlayed
    });
  } else {
    await setDoc(ref, {
      name,
      uid,
      playerName: name,
      playerUID: uid,
      score: delta,                 // can be 0 ✅
      lastScore: delta,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
}



// Add a history record (like your screenshot: score, timestamp, username)
async function addHistory(gameId, name, uid, score) {
  const historyCol = collection(leaderboardDb, "zat-am", gameId, "gameHistory");
  await addDoc(historyCol, {
    username: name,
    playerUID: uid,
    score: Number(score),
    timestamp: Date.now(),        
  });
}

export async function reportScore(score) {
  if (!CURRENT_USER) {
    CURRENT_USER = window.currentUser.displayName;
  }

  if (!CURRENT_USER) {
    return;
  }

  const s = Number(score);
  if (!Number.isFinite(s)) throw new Error("Score must be a number."); // 0 allowed ✅

  const id = safeId(CURRENT_USER);
  const name = CURRENT_USER;

  await ensureParentsUnderZatAm();

  // ✅ refs
  const gamePlayerRef = doc(db, "zat-am", BP26_GAME, "players", id);
  const bp26PlayerRef = doc(db, "zat-am", "bp26", "players", id);
  const globPlayerRef = doc(db, "zat-am", "Global", "players", id);

  // ✅ write players (so leaderboard shows it)
  await Promise.all([
    upsertIncrement(gamePlayerRef, name, s),
    upsertIncrement(bp26PlayerRef, name, s),
    upsertIncrement(globPlayerRef, name, s)
  ]);

  // ✅ write history (so format matches Game1)
  await Promise.all([
    addHistory(BP26_GAME, name, s),
    addHistory("Global", name, s)
    // (optional) if you also want bp26 history:
    // addHistory("bp26", name, s),
  ]);

  console.log("🔥 SCORE SAVED:", { game: BP26_GAME, user: id, score: s });
  return { ok: true };
}

// expose for non-module usage too
window.bp26Init = bp26Init;
window.reportScore = reportScore;
