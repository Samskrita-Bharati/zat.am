import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import {
  db,
} from "./auth/api/firebase-config.js";

// const timestamp = Date.now();
// const date = new Date(timestamp);
// const year = date.getFullYear();
// const month = String(date.getMonth() + 1).padStart(2, "0");
// // used for getting document for current month

export function checkFetchRequirements(startDate, endDate, newStart, newEnd, currentGame, selectedGame) {
  
  // if game has changed, fetch documents again
  if (currentGame !== selectedGame) {
    return true;
  }

  // if sorting by "All Dates" again, no need to fetch documents again
  if (startDate === 0 && newStart === 0) {
    return false;
  }

  // compare old and new date ranges to see if new documents need to be fetched
  if (
    new Date(startDate).getMonth() + 1 !== new Date(newStart).getMonth() + 1 ||
    new Date(startDate).getFullYear() !== new Date(newStart).getFullYear() ||
    new Date(endDate).getMonth() + 1 !== new Date(newEnd).getMonth() + 1 ||
    new Date(endDate).getFullYear() !== new Date(newEnd).getFullYear()
  ) {
    return true;
  }

  // new documents need to be fetched
  return false;
}

export async function getRawData(start, end, selectedGame) {
  const data = [];

  if (start === 0) {
    const gameHistoryRef = collection(
      db,
      "leaderboards",
      selectedGame,
      "gameHistory",
    );
    const snapshot = await getDocs(gameHistoryRef);
    snapshot.docs.forEach((docSnap) => {
      data.push({
        id: docSnap.id, // "YYYY-MM"
        ...docSnap.data(),
      });
    });
    const combinedData = [
      data.reduce((acc, curr) => {
        Object.assign(acc, curr.entries);
        return acc;
      }, {}),
    ];
    return formatRawData(combinedData);
  } else {
    const result = [];

    const current = new Date(start);
    current.setDate(1);

    const endDate = new Date(end);
    endDate.setDate(1);

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");

      result.push(`${year}-${month}`);

      // move to next month (handles year rollover automatically)
      current.setMonth(current.getMonth() + 1);
    }

    for (const formattedDate of result) {
      const gameHistories = doc(
        db,
        "leaderboards",
        selectedGame,
        "gameHistory",
        formattedDate,
      );
      const snapshot = await getDoc(gameHistories);
      if (snapshot.exists()) {
        data.push(snapshot.data());
      }
    }
    const combinedData = [
      data.reduce((acc, curr) => {
        Object.assign(acc, curr.entries);
        return acc;
      }, {}),
    ];
    return formatRawData(combinedData);
  }
}

function formatRawData(data) {
  const formattedData = Object.entries(data[0]).map(([key, score]) => {
    const [timestamp, uid] = key.split("_");

    return {
      uid,
      timestamp: Number(timestamp),
      score,
    };
  });
  return formattedData;
}
