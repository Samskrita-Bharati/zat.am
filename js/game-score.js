// =====================================================
// ZAT.AM SHARED GAME SCORING
// =====================================================
//
// Purpose:
// - One scoring submission path for all Zat.am games.
// - Final leaderboard scores must be integers from 0 to 100.
// - Higher score is always better.
// - A game should submit once when a real run is completed.
// - Individual games should NOT contain their own Firebase write logic.
//
// Typical usage from a top-level game:
//
//   import {
//     initGameScore,
//     submitGameScore,
//     scoreFromPenalties,
//   } from "../js/game-score.js";
//
//   initGameScore({
//     gameId: "009-mmk",
//     gameName: "Memory क्रीडा",
//   });
//
//   // When the game is actually finished:
//   const score = scoreFromPenalties({
//     mistakes: numberOfWrongTries,
//     hints: 0,
//   });
//
//   await submitGameScore(score, {
//     metrics: {
//       mistakes: numberOfWrongTries,
//       elapsedSeconds: secs,
//     },
//   });
//
// If the game restarts without reloading the page:
//   resetGameScore();
//
// IMPORTANT:
// This file intentionally does NOT decide one formula for every game.
// Different game types measure different skills. Use the shared helper
// that fits the game, or define an approved game-specific formula that
// still returns a final 0-100 score.
// =====================================================

import { auth, db, onAuthStateChanged } from "../auth/api/firebase-config.js";

import {
  doc,
  setDoc,
  writeBatch,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const SCORE_MIN = 0;
const SCORE_MAX = 100;

const state = {
  initialized: false,
  gameId: null,
  gameName: null,
  runStartedAt: Date.now(),
  submitted: false,
};

// =====================================================
// INTERNAL HELPERS
// =====================================================

function normalizeGameId(value) {
  const gameId = String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!gameId) {
    throw new Error(
      "[Zat.am Score] A valid gameId is required, for example: 009-mmk",
    );
  }

  return gameId;
}

function normalizeGameName(value) {
  const fallback = document.title?.trim() || "Zat.am Game";
  return String(value || fallback)
    .trim()
    .slice(0, 120);
}

function normalizeScore(value) {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    throw new Error("[Zat.am Score] Score must be a finite number.");
  }

  const rounded = Math.round(score);

  if (rounded < SCORE_MIN || rounded > SCORE_MAX) {
    throw new Error(
      `[Zat.am Score] Final score must be between ${SCORE_MIN} and ${SCORE_MAX}. Received: ${rounded}`,
    );
  }

  return rounded;
}

function nonNegativeNumber(value, fallback = 0) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(0, number);
}

function sanitizeMetrics(metrics = {}) {
  if (!metrics || typeof metrics !== "object" || Array.isArray(metrics)) {
    return {};
  }

  const clean = {};

  Object.entries(metrics).forEach(([key, value]) => {
    const safeKey = String(key)
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);

    if (!safeKey) return;

    if (typeof value === "number" && Number.isFinite(value)) {
      clean[safeKey] = value;
      return;
    }

    if (typeof value === "boolean") {
      clean[safeKey] = value;
      return;
    }

    if (typeof value === "string") {
      clean[safeKey] = value.slice(0, 200);
    }
  });

  return clean;
}

function getMonthId(timestamp = Date.now()) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

async function getAuthenticatedUser() {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  return new Promise((resolve) => {
    let finished = false;
    let unsubscribe = () => {};

    const finish = (user) => {
      if (finished) return;
      finished = true;
      unsubscribe();
      resolve(user || null);
    };

    unsubscribe = onAuthStateChanged(
      auth,
      (user) => finish(user),
      () => finish(null),
    );

    // Do not make a completed game wait forever for auth initialization.
    window.setTimeout(() => finish(auth.currentUser), 1500);
  });
}

async function ensureLeaderboardParents(gameId, gameName) {
  await Promise.all([
    setDoc(
      doc(db, "leaderboards", "Global"),
      {
        label: "Global",
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ),

    setDoc(
      doc(db, "leaderboards", gameId),
      {
        label: gameName || gameId,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ),
  ]);
}

// =====================================================
// PUBLIC INITIALIZATION
// =====================================================

export function initGameScore({ gameId, gameName } = {}) {
  state.gameId = normalizeGameId(gameId);
  state.gameName = normalizeGameName(gameName);
  state.runStartedAt = Date.now();
  state.submitted = false;
  state.initialized = true;

  console.info("[Zat.am Score] Initialized", {
    gameId: state.gameId,
    gameName: state.gameName,
  });

  return {
    gameId: state.gameId,
    gameName: state.gameName,
  };
}

export function resetGameScore() {
  state.runStartedAt = Date.now();
  state.submitted = false;

  console.info("[Zat.am Score] New run started", {
    gameId: state.gameId,
  });
}

// =====================================================
// SHARED SCORING HELPERS
// =====================================================

// Good default for Memory, matching, word-search, find-item, etc.
// Default:
// - start at 100
// - each mistake costs 5
// - each hint costs 10
//
// Time should normally be stored as a metric / tie-breaker instead of
// automatically punishing slower learners.
export function scoreFromPenalties({
  mistakes = 0,
  hints = 0,
  mistakePenalty = 5,
  hintPenalty = 10,
  baseScore = 100,
} = {}) {
  const raw =
    nonNegativeNumber(baseScore, 100) -
    nonNegativeNumber(mistakes) * nonNegativeNumber(mistakePenalty, 5) -
    nonNegativeNumber(hints) * nonNegativeNumber(hintPenalty, 10);

  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, Math.round(raw)));
}

// Good default for finite quizzes / matching activities.
//
// Example:
// 8 correct out of 10 = 80.
// Optional hints/mistakes can reduce that result further.
export function scoreFromAccuracy({
  correct = 0,
  total,
  mistakes = 0,
  hints = 0,
  mistakePenalty = 0,
  hintPenalty = 5,
} = {}) {
  const safeTotal = nonNegativeNumber(total);

  if (safeTotal <= 0) {
    throw new Error("[Zat.am Score] total must be greater than 0.");
  }

  const safeCorrect = Math.min(safeTotal, nonNegativeNumber(correct));

  const accuracy = (safeCorrect / safeTotal) * 100;

  const raw =
    accuracy -
    nonNegativeNumber(mistakes) * nonNegativeNumber(mistakePenalty) -
    nonNegativeNumber(hints) * nonNegativeNumber(hintPenalty, 5);

  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, Math.round(raw)));
}

// Good default for Wordle-style games where fewer attempts are better.
//
// Default 6-attempt scale:
// 1 -> 100
// 2 -> 90
// 3 -> 80
// 4 -> 70
// 5 -> 60
// 6 -> 50
// failed -> 0
export function scoreFromAttempts({
  attempts,
  maxAttempts = 6,
  solved = true,
  minimumSolvedScore = 50,
} = {}) {
  if (!solved) {
    return 0;
  }

  const safeMax = Math.max(1, Math.round(nonNegativeNumber(maxAttempts, 6)));
  const safeAttempts = Math.max(
    1,
    Math.min(safeMax, Math.round(nonNegativeNumber(attempts, 1))),
  );

  if (safeMax === 1) {
    return 100;
  }

  const floor = Math.max(
    SCORE_MIN,
    Math.min(SCORE_MAX, nonNegativeNumber(minimumSolvedScore, 50)),
  );

  const step = (100 - floor) / (safeMax - 1);
  const raw = 100 - (safeAttempts - 1) * step;

  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, Math.round(raw)));
}

// Utility for approved special formulas.
// It does NOT silently clamp invalid leaderboard scores during submission;
// submission still validates the final result.
export function clampScore(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, Math.round(number)));
}

// =====================================================
// SCORE SUBMISSION
// =====================================================

export async function submitGameScore(
  score,
  { result = "completed", metrics = {} } = {},
) {
  if (!state.initialized || !state.gameId) {
    throw new Error(
      "[Zat.am Score] Call initGameScore({ gameId, gameName }) before submitting.",
    );
  }

  if (state.submitted) {
    console.warn("[Zat.am Score] Score already submitted for this run.");

    return {
      ok: false,
      reason: "already-submitted",
    };
  }

  const finalScore = normalizeScore(score);
  const user = await getAuthenticatedUser();

  // Main-site games may still be playable while logged out.
  // In that case the game can show the local score, but there is no
  // leaderboard record until the player is authenticated.
  if (!user) {
    console.info(
      "[Zat.am Score] Player is not signed in. Local score was not saved to the leaderboard.",
    );

    return {
      ok: false,
      reason: "not-signed-in",
      score: finalScore,
    };
  }

  const completedAt = Date.now();
  const elapsedSeconds = Math.max(
    0,
    Math.floor((completedAt - state.runStartedAt) / 1000),
  );

  const monthId = getMonthId(completedAt);

  // Fourth segment is the gameId.
  //
  // Existing leaderboard parsing reads the first 3 values and therefore
  // remains compatible, while newer Global leaderboard logic can identify
  // which game produced each score.
  const entryKey = `${completedAt}_${user.uid}_${elapsedSeconds}_${state.gameId}`;

  const cleanMetrics = sanitizeMetrics(metrics);

  const attemptMeta = {
    gameId: state.gameId,
    gameName: state.gameName,
    result: String(result || "completed").slice(0, 40),
    elapsedSeconds,
    completedAt,
    ...cleanMetrics,
  };

  await ensureLeaderboardParents(state.gameId, state.gameName);

  const gameHistoryDoc = doc(
    db,
    "leaderboards",
    state.gameId,
    "gameHistory",
    monthId,
  );

  const globalHistoryDoc = doc(
    db,
    "leaderboards",
    "Global",
    "gameHistory",
    monthId,
  );

  const historyUpdate = {
    entries: {
      [entryKey]: finalScore,
    },

    // Keep metadata separate so the existing leaderboard's numeric
    // "entries" format continues to work.
    attemptMeta: {
      [entryKey]: attemptMeta,
    },

    updatedAt: serverTimestamp(),
  };

  const batch = writeBatch(db);

  batch.set(gameHistoryDoc, historyUpdate, { merge: true });
  batch.set(globalHistoryDoc, historyUpdate, { merge: true });

  await batch.commit();

  state.submitted = true;

  console.info("[Zat.am Score] Score saved", {
    gameId: state.gameId,
    score: finalScore,
    elapsedSeconds,
    uid: user.uid,
  });

  return {
    ok: true,
    gameId: state.gameId,
    score: finalScore,
    elapsedSeconds,
  };
}

// =====================================================
// GLOBAL API FOR OLD / NON-MODULE GAMES
// =====================================================
//
// Older Zat.am games can load this file with:
//   <script type="module" src="../js/game-score.js"></script>
//
// and then use:
//   window.zatamScore.init(...)
//   window.zatamScore.submit(...)
// =====================================================

if (typeof window !== "undefined") {
  window.zatamScore = {
    init: initGameScore,
    reset: resetGameScore,
    submit: submitGameScore,

    scoreFromPenalties,
    scoreFromAccuracy,
    scoreFromAttempts,
    clampScore,

    getState() {
      return {
        initialized: state.initialized,
        gameId: state.gameId,
        gameName: state.gameName,
        runStartedAt: state.runStartedAt,
        submitted: state.submitted,
      };
    },
  };
}
