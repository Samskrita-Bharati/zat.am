// zat.am/score-submit.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA5-cHjL5iL8Arjqv2Pt2WecT8RTLw3Weg",
  authDomain: "zatam-leaderboard.firebaseapp.com",
  projectId: "zatam-leaderboard",
  storageBucket: "zatam-leaderboard.firebasestorage.app",
  messagingSenderId: "1053027312775",
  appId: "1:1053027312775:web:43325a831ab077d017c422",
  measurementId: "G-KP78X2DN6L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function safeId(s) {
  return String(s || "guest")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .slice(0, 40);
}

/**
 * submitScore(gameId, playerName, points)
 * - Adds points to aggregate + per-game
 * - Call this ONLY ONCE per game end (win).
 */
export async function submitScore(gameId, playerName, points) {
  const gid = safeId(gameId || "unknown_game");
  const pname = (playerName || "Guest").trim() || "Guest";
  const pid = safeId(pname);

  const pts = Number(points);
  if (!Number.isFinite(pts) || pts <= 0) return;

  // 1) Aggregate (All games)
  const aggRef = doc(db, "scores_aggregate", pid);
  await setDoc(
    aggRef,
    {
      playerId: pid,
      playerName: pname,
      totalScore: increment(pts),
      updatedAt: Date.now()
    },
    { merge: true }
  );

  // 2) Per-game (One game)
  const gameDocId = `${gid}_${pid}`;
  const gameRef = doc(db, "scores_game", gameDocId);
  await setDoc(
    gameRef,
    {
      gameId: gid,
      playerId: pid,
      playerName: pname,
      score: increment(pts),
      updatedAt: Date.now()
    },
    { merge: true }
  );
}
