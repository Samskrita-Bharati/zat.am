import {
  collection,
  getDocs,
  doc,
  getDoc,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { db } from "./auth/api/firebase-config.js";

const LEGACY_BP26_GAME_LABELS = Object.freeze({
  "bp26-Game1": "Vocabulary (शब्दावली)",
  "bp26-Game2": "Memory Game (क्रीडा)",
  "bp26-Game3": "Find It (अन्वेषणम्)",
  "bp26-Game4": "Word Search",
  "bp26-Game5": "Audio Match",
  "bp26-Game6": "Word Repeat (पुनरुक्ति)",
  "bp26-Game7": "Picture Repeat (पुनरावर्तनम्)",
});

function getFriendlyGameLabel(gameId, storedLabel) {
  const fallback = LEGACY_BP26_GAME_LABELS[gameId] || gameId;
  const label = String(storedLabel || "").trim();

  if (!label || label === gameId) {
    return fallback;
  }

  return label;
}

/*
=====================================================
ONE-TIME LEGACY BP26 LABEL MIGRATION
=====================================================

Only parent-document labels are changed. Score/history data is untouched.
The operation is idempotent: once labels match, no writes are made.
*/

export async function migrateLegacyBp26Labels() {
  const snapshot = await getDocs(collection(db, "leaderboards"));
  const docsById = new Map(
    snapshot.docs.map((docSnap) => [docSnap.id, docSnap]),
  );
  const batch = writeBatch(db);
  let updateCount = 0;

  Object.entries(LEGACY_BP26_GAME_LABELS).forEach(([gameId, label]) => {
    const docSnap = docsById.get(gameId);

    if (!docSnap) {
      return;
    }

    const currentLabel = String(docSnap.data()?.label || "").trim();

    if (currentLabel === label) {
      return;
    }

    batch.set(docSnap.ref, { label }, { merge: true });
    updateCount += 1;
  });

  if (updateCount > 0) {
    await batch.commit();
  }

  return updateCount;
}

/*
=====================================================
GET LEADERBOARD-ENABLED GAMES
=====================================================

Every scored game creates/updates a parent document under:
leaderboards/{gameId}

The shared scorer stores the human-readable game name in `label`.
Global is excluded because it is an aggregate leaderboard, not a game.
*/

export async function getLeaderboardGames() {
  const snapshot = await getDocs(collection(db, "leaderboards"));

  return snapshot.docs
    .filter((docSnap) => docSnap.id !== "Global")
    .map((docSnap) => {
      const data = docSnap.data() || {};

      return {
        id: docSnap.id,
        name: getFriendlyGameLabel(docSnap.id, data.label),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/* CHECK WHETHER FIRESTORE NEEDS TO BE FETCHED AGAIN */

export function checkFetchRequirements(
  startDate,
  endDate,
  newStart,
  newEnd,
  currentGame,
  selectedGame,
) {
  // Game changed
  if (currentGame !== selectedGame) {
    return true;
  }

  // Already loaded all dates
  if (startDate === 0 && newStart === 0) {
    return false;
  }

  // Different month/year range requires another Firestore fetch
  if (
    new Date(startDate).getMonth() !== new Date(newStart).getMonth() ||
    new Date(startDate).getFullYear() !== new Date(newStart).getFullYear() ||
    new Date(endDate).getMonth() !== new Date(newEnd).getMonth() ||
    new Date(endDate).getFullYear() !== new Date(newEnd).getFullYear()
  ) {
    return true;
  }

  return false;
}

/*
=====================================================
GET RAW LEADERBOARD HISTORY
=====================================================
*/

export async function getRawData(start, end, selectedGame) {
  const historyDocuments = [];

  /* ALL DATES */

  if (start === 0) {
    const gameHistoryRef = collection(
      db,
      "leaderboards",
      selectedGame,
      "gameHistory",
    );

    const snapshot = await getDocs(gameHistoryRef);

    snapshot.docs.forEach((docSnap) => {
      historyDocuments.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });
  } else {
    /*
    -----------------------------------------------------
    SPECIFIC DATE RANGE
    -----------------------------------------------------
    */

    const months = [];

    const current = new Date(start);
    current.setDate(1);

    const endDate = new Date(end);
    endDate.setDate(1);

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");

      months.push(`${year}-${month}`);

      current.setMonth(current.getMonth() + 1);
    }

    for (const monthId of months) {
      const historyDocRef = doc(
        db,
        "leaderboards",
        selectedGame,
        "gameHistory",
        monthId,
      );

      const snapshot = await getDoc(historyDocRef);

      if (snapshot.exists()) {
        historyDocuments.push(snapshot.data());
      }
    }
  }

  /*
  -----------------------------------------------------
  MERGE MONTHLY DOCUMENTS
  -----------------------------------------------------

  Existing Firebase structure:

  entries: {
    historyKey: score
  }

  New scoring system can also store:

  attemptMeta: {
    historyKey: {
      gameId,
      mistakes,
      hints,
      elapsedSeconds,
      ...
    }
  }

  Old records without attemptMeta remain supported.
  -----------------------------------------------------
  */

  const combinedEntries = {};
  const combinedMeta = {};

  historyDocuments.forEach((history) => {
    if (history.entries && typeof history.entries === "object") {
      Object.assign(combinedEntries, history.entries);
    }

    if (history.attemptMeta && typeof history.attemptMeta === "object") {
      Object.assign(combinedMeta, history.attemptMeta);
    }
  });

  return formatRawData(combinedEntries, combinedMeta, selectedGame);
}

/*
=====================================================
FORMAT FIRESTORE HISTORY
=====================================================

OLD HISTORY KEY:
timestamp_uid_timePlayed

NEW HISTORY KEY:
timestamp_uid_timePlayed_gameId

Example:

1760634000000_abc123_42_009-mmk

The fourth value allows Global leaderboard entries to know
which game produced the score.

For old per-game records, selectedGame is used as a fallback.

Old Global records cannot reliably know their game because the
old Global history did not save gameId. These records are marked
as legacy instead of guessing.
=====================================================
*/

function formatRawData(entries, attemptMeta, selectedGame) {
  return Object.entries(entries)
    .map(([key, rawScore]) => {
      const parts = key.split("_");

      const timestamp = Number(parts[0]);
      const uid = parts[1] || "";
      const timePlayed = Number(parts[2]) || 0;

      /*
      Everything after the first three values belongs
      to gameId.

      join("_") also gives us some protection if a future
      game ID contains an underscore.
      */

      const gameIdFromKey = parts.length > 3 ? parts.slice(3).join("_") : null;

      const meta = attemptMeta && attemptMeta[key] ? attemptMeta[key] : {};

      /*
      Priority:

      1. Metadata gameId
      2. New history-key gameId
      3. Selected per-game leaderboard
      4. "legacy" for old Global records
      */

      let gameId = meta.gameId || gameIdFromKey || null;

      if (!gameId && selectedGame !== "Global") {
        gameId = selectedGame;
      }

      if (!gameId) {
        gameId = "legacy";
      }

      const score = Number(rawScore);

      /*
      LEVEL COMPATIBILITY

      New attempts:
      - meta.levelId
      - meta.levelName

      Existing integrations may already have stored level information
      through custom metrics. Because the current shared scorer flattens
      metrics into attemptMeta, meta.levelId already covers that format.

      A small number of older puzzle results may only have puzzleSize.
      We preserve that value as a fallback level identifier instead of
      guessing a game-specific Level 1 / Level 2 mapping.
      */

      const nestedMetrics =
        meta.metrics && typeof meta.metrics === "object" ? meta.metrics : {};

      const rawLevelId =
        meta.levelId ??
        nestedMetrics.levelId ??
        meta.puzzleSize ??
        nestedMetrics.puzzleSize ??
        null;

      const rawLevelName = meta.levelName ?? nestedMetrics.levelName ?? null;

      const levelId =
        rawLevelId === undefined || rawLevelId === null || rawLevelId === ""
          ? null
          : String(rawLevelId).trim();

      const levelName =
        rawLevelName === undefined ||
        rawLevelName === null ||
        rawLevelName === ""
          ? null
          : String(rawLevelName).trim();

      const gameName =
        typeof meta.gameName === "string" && meta.gameName.trim()
          ? meta.gameName.trim()
          : null;

      if (!uid || !Number.isFinite(timestamp) || !Number.isFinite(score)) {
        console.warn("[Leaderboard] Ignoring invalid history entry:", key);

        return null;
      }

      return {
        key,

        uid,

        timestamp,

        score,

        timePlayed,

        gameId,
        gameName,
        levelId,
        levelName,

        /*
        Keep metadata available for future use.

        Examples:
        mistakes
        hints
        moves
        nativeScore
        difficulty
        elapsedSeconds
        */

        meta,
      };
    })
    .filter(Boolean);
}
