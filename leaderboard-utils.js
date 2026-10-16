import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { db } from "./auth/api/firebase-config.js";

/*
=====================================================
CHECK WHETHER FIRESTORE NEEDS TO BE FETCHED AGAIN
=====================================================
*/

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

  /*
  -----------------------------------------------------
  ALL DATES
  -----------------------------------------------------
  */

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
      Ignore malformed records instead of letting NaN
      break leaderboard sorting.
      */

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
