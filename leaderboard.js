import {
  collection,
  getDocs,
  doc,
  getDoc,
  writeBatch,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { auth, db } from "./auth/api/firebase-config.js";

import {
  getLeaderboardGames,
  getRawData,
  migrateLegacyBp26Labels,
} from "./leaderboard-utils.js";

// =====================================================
// PAGE STATE
// =====================================================

const state = {
  activeView: "overall",
  currentUser: null,
  currentRawData: [],
  allTimeGlobalHistory: [],
  leaderboardData: [],
  currentPage: 1,
  perPage: 10,
  games: [],
  gameMap: new Map(),
  profileCache: new Map(),
  levelOptionsCache: new Map(),
  legacyBp26LabelsMigrated: false,
};

// =====================================================
// ELEMENTS
// =====================================================

const gameSelect = document.getElementById("gameSelect");
const levelSelect = document.getElementById("levelSelect");
const timeSelect = document.getElementById("timeFilter");
const seasonDate = document.getElementById("seasonDate");
const scoringField = document.getElementById("scoringField");
const filterTitle = document.getElementById("filterTitle");
const filterRangeDisplay = document.getElementById("filterRangeDisplay");

const rankingSection = document.getElementById("rankingSection");
const rankingTitle = document.getElementById("rankingTitle");

const leaderboardTableHeader = document.getElementById(
  "leaderboardTableHeader",
);
const leaderboard = document.getElementById("leaderboard");
const leaderboardEmpty = document.getElementById("leaderboardEmpty");
const pagination = document.getElementById("pagination");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNum = document.getElementById("pageNum");
const totalPages = document.getElementById("totalPages");

const myRankSignedOut = document.getElementById("myRankSignedOut");
const myRankContent = document.getElementById("myRankContent");
const myRankAvatar = document.getElementById("myRankAvatar");
const myRankName = document.getElementById("myRankName");
const myRankEmail = document.getElementById("myRankEmail");
const myRankPosition = document.getElementById("myRankPosition");
const myRankScore = document.getElementById("myRankScore");
const myRankScoreLabel = document.getElementById("myRankScoreLabel");
const myRankContext = document.getElementById("myRankContext");
const myRankContextLabel = document.getElementById("myRankContextLabel");
const myRankHint = document.getElementById("myRankHint");

const recentHistorySignedOut = document.getElementById(
  "recentHistorySignedOut",
);
const recentHistoryList = document.getElementById("recentHistoryList");
const viewAllHistoryBtn = document.getElementById("viewAllHistoryBtn");

const adminPanel = document.getElementById("adminPanel");
const adminContext = document.getElementById("adminContext");
const statusToggle = document.getElementById("statusToggle");
const resetBtn = document.getElementById("resetBtn");
const resetHint = document.getElementById("resetHint");

// =====================================================
// GENERAL HELPERS
// =====================================================

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getScoringSystem() {
  return (
    document.querySelector('input[name="scoringSystem"]:checked')?.value ||
    "totalScore"
  );
}

function formatNumberOrDash(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString() : "—";
}

function formatSeconds(totalSeconds) {
  const safe = Math.max(0, Number(totalSeconds) || 0);
  const seconds = Math.floor(safe);

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0",
    )}`;
  }

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function formatDateTime(timestamp) {
  if (!Number.isFinite(Number(timestamp))) {
    return "—";
  }

  return new Date(Number(timestamp)).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function maskEmail(email) {
  const value = String(email || "").trim();

  if (!value.includes("@")) {
    return value || "Signed in";
  }

  const [local, domain] = value.split("@");

  if (!local) {
    return `***@${domain}`;
  }

  if (local.length === 1) {
    return `${local}***@${domain}`;
  }

  return `${local[0]}***${local.at(-1)}@${domain}`;
}

function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "?";

  return parts.map((part) => part[0]?.toUpperCase() || "").join("");
}

function getGameName(record) {
  if (record?.gameName) {
    return record.gameName;
  }

  return state.gameMap.get(record?.gameId) || record?.gameId || "Unknown Game";
}

function hasLevel(record) {
  return !
    (record?.levelId === null ||
      record?.levelId === undefined ||
      record?.levelId === "") ||
    Boolean(record?.levelName);
}

function getLevelKey(record) {
  return record?.levelId === null ||
    record?.levelId === undefined ||
    record?.levelId === ""
    ? "__no_level__"
    : String(record.levelId);
}

function getLevelDisplay(record) {
  if (record?.levelName) {
    return record.levelName;
  }

  if (
    record?.levelId === null ||
    record?.levelId === undefined ||
    record?.levelId === ""
  ) {
    return "—";
  }

  return `Level ${record.levelId}`;
}

function isBetterAttempt(candidate, current) {
  if (!current) return true;

  if (candidate.score !== current.score) {
    return candidate.score > current.score;
  }

  if (candidate.timePlayed !== current.timePlayed) {
    return candidate.timePlayed < current.timePlayed;
  }

  return candidate.timestamp > current.timestamp;
}

function getFilterRange(mode, pickedDate) {
  const base = pickedDate ? new Date(`${pickedDate}T00:00:00`) : new Date();
  const pickedStart = new Date(base).setHours(0, 0, 0, 0);

  if (mode === "allDates") {
    return {
      newStart: 0,
      newEnd: Date.now(),
    };
  }

  let newStart = 0;
  let newEnd = Date.now();

  switch (mode) {
    case "daily": {
      newStart = pickedStart;
      newEnd = pickedStart + 86400000 - 1;
      break;
    }

    case "weekly": {
      const day = base.getDay();
      const sunday = new Date(base);
      sunday.setDate(base.getDate() - day);
      newStart = sunday.setHours(0, 0, 0, 0);

      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);
      newEnd = saturday.setHours(23, 59, 59, 999);
      break;
    }

    case "monthly": {
      newStart = new Date(base.getFullYear(), base.getMonth(), 1).getTime();
      newEnd =
        new Date(base.getFullYear(), base.getMonth() + 1, 1).getTime() - 1;
      break;
    }
  }

  return { newStart, newEnd };
}

function updateRangeDisplay() {
  if (timeSelect.value === "allDates") {
    filterRangeDisplay.textContent = "Showing: All Time Records";
    return;
  }

  const { newStart, newEnd } = getFilterRange(
    timeSelect.value,
    seasonDate.value,
  );

  filterRangeDisplay.textContent = `Showing: ${new Date(
    newStart,
  ).toLocaleDateString()} — ${new Date(newEnd).toLocaleDateString()}`;
}

function filterRawDataByRange(rawData) {
  const { newStart, newEnd } = getFilterRange(
    timeSelect.value,
    seasonDate.value,
  );

  return rawData.filter(
    (record) =>
      Number.isFinite(record.timestamp) &&
      record.timestamp >= newStart &&
      record.timestamp <= newEnd,
  );
}

// =====================================================
// USER PROFILE
// =====================================================

async function getUserProfile(uid) {
  if (!uid) {
    return {
      name: "Unknown Player",
      location: "Unknown",
    };
  }

  if (state.profileCache.has(uid)) {
    return state.profileCache.get(uid);
  }

  const userDocRef = doc(db, "users", uid, "public", "profile");
  const userSnap = await getDoc(userDocRef);

  let profile = {
    name: "Unknown Player",
    location: "Unknown",
  };

  if (userSnap.exists()) {
    const data = userSnap.data();
    const locationParts = String(data.location || "").split(/[，,]/);

    profile = {
      name: data.name || "Unknown Player",
      location:
        locationParts[locationParts.length - 1]?.trim() || "Unknown",
    };
  }

  state.profileCache.set(uid, profile);

  return profile;
}

async function attachProfiles(rows) {
  return Promise.all(
    rows.map(async (row) => {
      const profile = await getUserProfile(row.uid);

      return {
        ...row,
        username: profile.name,
        location: profile.location,
      };
    }),
  );
}

// =====================================================
// GAME + LEVEL FILTERS
// =====================================================

async function loadGameOptions() {
  state.games = await getLeaderboardGames();
  state.gameMap = new Map(state.games.map((game) => [game.id, game.name]));

  const sortByName = (a, b) =>
    a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });

  const bp26Games = state.games
    .filter((game) => game.id.startsWith("bp26-"))
    .sort(sortByName);

  const zatamGames = state.games
    .filter((game) => !game.id.startsWith("bp26-"))
    .sort(sortByName);

  const renderOption = (game, { prefixBp26 = false } = {}) => {
    const label = prefixBp26 ? `BP26 — ${game.name}` : game.name;

    return `<option value="${escapeHtml(game.id)}">${escapeHtml(label)}</option>`;
  };

  const optionGroups = ['<option value="all">All Games</option>'];

  if (bp26Games.length > 0) {
    optionGroups.push(`
      <optgroup label="BP26 Competition">
        ${bp26Games
          .map((game) => renderOption(game, { prefixBp26: true }))
          .join("")}
      </optgroup>
    `);
  }

  if (zatamGames.length > 0) {
    optionGroups.push(`
      <optgroup label="Zat.am Games">
        ${zatamGames.map((game) => renderOption(game)).join("")}
      </optgroup>
    `);
  }

  gameSelect.innerHTML = optionGroups.join("");
}

async function getKnownLevelsForGame(gameId) {
  if (!gameId || gameId === "all") {
    return [];
  }

  if (state.levelOptionsCache.has(gameId)) {
    return state.levelOptionsCache.get(gameId);
  }

  const attempts = await getRawData(0, Date.now(), gameId);
  const levels = new Map();

  attempts.forEach((record) => {
    const key = getLevelKey(record);

    if (key === "__no_level__") {
      return;
    }

    if (!levels.has(key)) {
      levels.set(key, {
        id: String(record.levelId),
        name: getLevelDisplay(record),
      });
    }
  });

  const sortedLevels = [...levels.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  state.levelOptionsCache.set(gameId, sortedLevels);

  return sortedLevels;
}

async function refreshLevelOptions() {
  const selectedGame = gameSelect.value;

  if (!selectedGame || selectedGame === "all") {
    levelSelect.innerHTML = '<option value="all">All Levels</option>';
    levelSelect.value = "all";
    levelSelect.disabled = true;
    return;
  }

  const levels = await getKnownLevelsForGame(selectedGame);

  if (levels.length === 0) {
    levelSelect.innerHTML = '<option value="all">No Levels</option>';
    levelSelect.value = "all";
    levelSelect.disabled = true;
    return;
  }

  const previousValue = levelSelect.value;

  levelSelect.innerHTML = [
    '<option value="all">All Levels</option>',
    ...levels.map(
      (level) =>
        `<option value="${escapeHtml(level.id)}">${escapeHtml(
          level.name,
        )}</option>`,
    ),
  ].join("");

  levelSelect.disabled = false;

  if (levels.some((level) => level.id === previousValue)) {
    levelSelect.value = previousValue;
  } else {
    levelSelect.value = "all";
  }
}

// =====================================================
// DATA FETCHING
// =====================================================

function getSourceGameForCurrentView() {
  if (state.activeView === "overall") {
    return "Global";
  }

  return gameSelect.value === "all" ? "Global" : gameSelect.value;
}

async function fetchCurrentRawData() {
  const sourceGame = getSourceGameForCurrentView();
  const { newStart, newEnd } = getFilterRange(
    timeSelect.value,
    seasonDate.value,
  );

  state.currentRawData = await getRawData(newStart, newEnd, sourceGame);
}

async function loadAllTimeGlobalHistory() {
  state.allTimeGlobalHistory = await getRawData(0, Date.now(), "Global");
}

// =====================================================
// OVERALL LEADERBOARD
// =====================================================

async function generateOverallLeaderboard(rawData) {
  const scoringSystem = getScoringSystem();
  const players = new Map();

  filterRawDataByRange(rawData).forEach((record) => {
    if (!record.uid || !record.gameId || record.gameId === "legacy") {
      return;
    }

    const score = Number(record.score);
    const timePlayed = Number(record.timePlayed) || 0;

    if (!Number.isFinite(score)) {
      return;
    }

    if (!players.has(record.uid)) {
      players.set(record.uid, {
        uid: record.uid,
        totalTimePlayed: 0,
        latestTimestamp: record.timestamp,
        bestByGameLevel: new Map(),
      });
    }

    const player = players.get(record.uid);

    player.totalTimePlayed += timePlayed;
    player.latestTimestamp = Math.max(
      player.latestTimestamp,
      record.timestamp,
    );

    /*
    OVERALL MULTI-LEVEL RULE

    1. Keep only the player's best attempt for each distinct
       Game + Level combination.
    2. For each game, average those distinct level-best scores.
    3. Round that game contribution to the nearest whole number.
    4. Sum the per-game contributions for the player's Overall Score.

    A game without levels still has just one "__no_level__" bucket,
    so its contribution remains its single best score.

    If a game has real level-tagged attempts, an older untagged attempt
    is ignored for that game's Overall average rather than being treated
    as an extra fake level.
    */
    const levelKey = getLevelKey(record);
    const playerGameLevelKey = `${record.gameId}::${levelKey}`;
    const previousBest = player.bestByGameLevel.get(playerGameLevelKey);

    const candidate = {
      gameId: record.gameId,
      levelKey,
      score,
      timePlayed,
      timestamp: record.timestamp,
    };

    if (isBetterAttempt(candidate, previousBest)) {
      player.bestByGameLevel.set(playerGameLevelKey, candidate);
    }
  });

  let rows = [...players.values()]
    .map((player) => {
      const attemptsByGame = new Map();

      [...player.bestByGameLevel.values()].forEach((attempt) => {
        if (!attemptsByGame.has(attempt.gameId)) {
          attemptsByGame.set(attempt.gameId, []);
        }

        attemptsByGame.get(attempt.gameId).push(attempt);
      });

      const gameContributions = [];

      attemptsByGame.forEach((attempts, gameId) => {
        const taggedLevels = attempts.filter(
          (attempt) => attempt.levelKey !== "__no_level__",
        );

        const attemptsToAverage =
          taggedLevels.length > 0 ? taggedLevels : attempts;

        if (attemptsToAverage.length === 0) {
          return;
        }

        const scoreAverage =
          attemptsToAverage.reduce(
            (sum, attempt) => sum + attempt.score,
            0,
          ) / attemptsToAverage.length;

        const contributionScore = Math.round(scoreAverage);
        const contributionTime = attemptsToAverage.reduce(
          (sum, attempt) => sum + attempt.timePlayed,
          0,
        );

        const latestTimestamp = Math.max(
          ...attemptsToAverage.map((attempt) => attempt.timestamp),
        );

        gameContributions.push({
          gameId,
          score: contributionScore,
          timePlayed: contributionTime,
          latestTimestamp,
          levelsCount: attemptsToAverage.length,
        });
      });

      if (gameContributions.length === 0) {
        return null;
      }

      const totalScore = gameContributions.reduce(
        (sum, game) => sum + game.score,
        0,
      );

      const bestTimePlayed = gameContributions.reduce(
        (sum, game) => sum + game.timePlayed,
        0,
      );

      return {
        uid: player.uid,
        totalScore,
        totalTimePlayed: player.totalTimePlayed,
        totalTimePlayedDisplay: formatSeconds(player.totalTimePlayed),
        bestTimePlayed,
        bestTimePlayedDisplay: formatSeconds(bestTimePlayed),
        latestTimestamp: player.latestTimestamp,
        gamesCount: gameContributions.length,
        gameContributions,
      };
    })
    .filter(Boolean);

  rows.sort((a, b) => {
    if (scoringSystem === "totalTimePlayed") {
      if (b.totalTimePlayed !== a.totalTimePlayed) {
        return b.totalTimePlayed - a.totalTimePlayed;
      }
    } else if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }

    if (a.bestTimePlayed !== b.bestTimePlayed) {
      return a.bestTimePlayed - b.bestTimePlayed;
    }

    return b.latestTimestamp - a.latestTimestamp;
  });

  rows = rows.map((row, index) => ({
    ...row,
    rank: index + 1,
  }));

  return attachProfiles(rows);
}

// =====================================================
// GAME + LEVEL LEADERBOARD
// =====================================================

async function generateGameLeaderboard(rawData) {
  const scoringSystem = getScoringSystem();
  const selectedGame = gameSelect.value;
  const selectedLevel = levelSelect.value;

  const bestByPlayerGameLevel = new Map();
  const totalsByPlayerGameLevel = new Map();

  filterRawDataByRange(rawData).forEach((record) => {
    if (!record.uid || !record.gameId || record.gameId === "legacy") {
      return;
    }

    if (selectedGame !== "all" && record.gameId !== selectedGame) {
      return;
    }

    const levelKey = getLevelKey(record);

    if (
      selectedGame !== "all" &&
      selectedLevel !== "all" &&
      levelKey !== selectedLevel
    ) {
      return;
    }

    const groupKey = `${record.gameId}::${levelKey}`;
    const playerKey = `${record.uid}::${groupKey}`;

    const score = Number(record.score);
    const timePlayed = Number(record.timePlayed) || 0;

    if (!Number.isFinite(score)) {
      return;
    }

    const totalTime = totalsByPlayerGameLevel.get(playerKey) || 0;
    totalsByPlayerGameLevel.set(playerKey, totalTime + timePlayed);

    const current = bestByPlayerGameLevel.get(playerKey);
    const candidate = {
      uid: record.uid,
      gameId: record.gameId,
      gameName: getGameName(record),
      levelId: record.levelId,
      levelName: record.levelName,
      levelKey,
      groupKey,
      score,
      timePlayed,
      timestamp: record.timestamp,
      result: record.meta?.result || "completed",
    };

    if (isBetterAttempt(candidate, current)) {
      bestByPlayerGameLevel.set(playerKey, candidate);
    }
  });

  const groups = new Map();

  [...bestByPlayerGameLevel.entries()].forEach(([playerKey, attempt]) => {
    const row = {
      ...attempt,
      totalScore: attempt.score,
      bestScore: attempt.score,
      bestTimePlayed: attempt.timePlayed,
      totalTimePlayed: totalsByPlayerGameLevel.get(playerKey) || 0,
    };

    if (!groups.has(row.groupKey)) {
      groups.set(row.groupKey, []);
    }

    groups.get(row.groupKey).push(row);
  });

  const rankedRows = [];

  groups.forEach((rows) => {
    rows.sort((a, b) => {
      if (scoringSystem === "totalTimePlayed") {
        if (b.totalTimePlayed !== a.totalTimePlayed) {
          return b.totalTimePlayed - a.totalTimePlayed;
        }
      } else if (b.bestScore !== a.bestScore) {
        return b.bestScore - a.bestScore;
      }

      if (a.bestTimePlayed !== b.bestTimePlayed) {
        return a.bestTimePlayed - b.bestTimePlayed;
      }

      return b.timestamp - a.timestamp;
    });

    rows.forEach((row, index) => {
      rankedRows.push({
        ...row,
        rank: index + 1,
        timeDisplay:
          scoringSystem === "totalTimePlayed"
            ? formatSeconds(row.totalTimePlayed)
            : formatSeconds(row.bestTimePlayed),
      });
    });
  });

  rankedRows.sort((a, b) => {
    const gameCompare = a.gameName.localeCompare(b.gameName, undefined, {
      numeric: true,
      sensitivity: "base",
    });

    if (gameCompare !== 0) {
      return gameCompare;
    }

    const levelCompare = getLevelDisplay(a).localeCompare(
      getLevelDisplay(b),
      undefined,
      {
        numeric: true,
        sensitivity: "base",
      },
    );

    if (levelCompare !== 0) {
      return levelCompare;
    }

    return a.rank - b.rank;
  });

  return attachProfiles(rankedRows);
}

// =====================================================
// PERSONAL HISTORY
// =====================================================

function getCurrentUserHistory(rawData) {
  if (!state.currentUser) {
    return [];
  }

  const selectedGame = gameSelect.value;
  const selectedLevel = levelSelect.value;

  return filterRawDataByRange(rawData)
    .filter((record) => record.uid === state.currentUser.uid)
    .filter((record) => {
      if (selectedGame === "all") return true;
      return record.gameId === selectedGame;
    })
    .filter((record) => {
      if (selectedGame === "all" || selectedLevel === "all") return true;
      return getLevelKey(record) === selectedLevel;
    })
    .sort((a, b) => b.timestamp - a.timestamp);
}

function getRecentUserHistory() {
  if (!state.currentUser) {
    return [];
  }

  return state.allTimeGlobalHistory
    .filter((record) => record.uid === state.currentUser.uid)
    .filter((record) => record.gameId && record.gameId !== "legacy")
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6);
}

// =====================================================
// VIEW + TABLE CONFIGURATION
// =====================================================

function setTableHeader(view) {
  leaderboardTableHeader.className = "leaderboard-table-header";

  if (view === "overall") {
    leaderboardTableHeader.classList.add("leaderboard-table-header-overall");
    leaderboardTableHeader.innerHTML = `
      <div>Rank</div>
      <div>Player</div>
      <div>Overall Score</div>
      <div>Ranked Games</div>
      <div>Time</div>
    `;
    return;
  }

  if (view === "game") {
    const isAllGames = gameSelect.value === "all";

    leaderboardTableHeader.classList.add(
      isAllGames
        ? "leaderboard-table-header-game-all"
        : "leaderboard-table-header-game",
    );

    leaderboardTableHeader.innerHTML = isAllGames
      ? `
          <div>Game Rank</div>
          <div>Player</div>
          <div>Best Score</div>
          <div>Time</div>
        `
      : `
          <div>Rank</div>
          <div>Player</div>
          <div>Game</div>
          <div>Level</div>
          <div>Best Score</div>
          <div>Time</div>
        `;
    return;
  }

  leaderboardTableHeader.classList.add("leaderboard-table-header-history");
  leaderboardTableHeader.innerHTML = `
    <div>Date</div>
    <div>Game</div>
    <div>Level</div>
    <div>Score</div>
    <div>Time</div>
    <div>Result</div>
  `;
}

function updateDatePickerState() {
  const isAllTime = timeSelect.value === "allDates";

  seasonDate.disabled = isAllTime;
  seasonDate.setAttribute("aria-disabled", String(isAllTime));
  seasonDate.title = isAllTime
    ? "Choose Date is not used when Time Period is All Time."
    : "";
}

function updateViewControls() {
  updateDatePickerState();

  document.querySelectorAll(".lb-view-tab").forEach((button) => {
    const isActive = button.dataset.view === state.activeView;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  const isOverall = state.activeView === "overall";
  const isHistory = state.activeView === "history";

  gameSelect.disabled = isOverall;

  if (isOverall) {
    gameSelect.value = "all";
    levelSelect.value = "all";
    levelSelect.disabled = true;
    filterTitle.textContent = "Overall Leaderboard";
    rankingTitle.textContent = "Hall of Champions";
  } else if (state.activeView === "game") {
    filterTitle.textContent = "Game Leaderboard";
  } else {
    filterTitle.textContent = "My Game History";
  }

  scoringField.hidden = isHistory;
  rankingSection.hidden = !isOverall;

  setTableHeader(state.activeView);
}

function getPodiumRows() {
  if (state.activeView !== "overall") {
    return [];
  }

  return state.leaderboardData.slice(0, 3);
}

// =====================================================
// RENDER PODIUM
// =====================================================

function renderPodium() {
  rankingSection.hidden = state.activeView !== "overall";

  if (rankingSection.hidden) {
    return;
  }

  const podiumRows = getPodiumRows();
  rankingTitle.textContent = "Hall of Champions";

  for (let i = 0; i < 3; i++) {
    const player = podiumRows[i];

    const username = document.getElementById(`name-${i + 1}`);
    const location = document.getElementById(`location-${i + 1}`);
    const score = document.getElementById(`score-${i + 1}`);

    username.textContent = player ? player.username : "---";
    location.textContent = player ? `📍 ${player.location}` : "---";

    if (!player) {
      score.textContent = "---";
      continue;
    }

    if (getScoringSystem() === "totalTimePlayed") {
      score.textContent = formatSeconds(player.totalTimePlayed);
    } else if (state.activeView === "overall") {
      score.textContent = player.totalScore.toLocaleString();
    } else {
      score.textContent = player.bestScore.toLocaleString();
    }
  }
}

// =====================================================
// RENDER MAIN TABLE
// =====================================================

function renderOverallRows(rows) {
  return rows
    .map(
      (row) => `
        <div class="row row-overall">
          <div class="rank">${row.rank}</div>

          <div class="player-cell">
            <strong>${escapeHtml(row.username)}</strong>
            <span>📍 ${escapeHtml(row.location)}</span>
          </div>

          <div class="score">${formatNumberOrDash(row.totalScore)}</div>

          <div class="games-count">${row.gamesCount}</div>

          <div class="time">${escapeHtml(
            getScoringSystem() === "totalTimePlayed"
              ? row.totalTimePlayedDisplay
              : row.bestTimePlayedDisplay,
          )}</div>
        </div>
      `,
    )
    .join("");
}

function getGameGroupHeading(row) {
  const gameName = row.gameId.startsWith("bp26-")
    ? `BP26 — ${row.gameName}`
    : row.gameName;

  const levelDisplay = getLevelDisplay(row);

  return levelDisplay === "—"
    ? gameName
    : `${gameName} · ${levelDisplay}`;
}

function renderAllGamesRows(rows) {
  let previousGroupKey = null;

  return rows
    .map((row) => {
      const showGroupHeading = row.groupKey !== previousGroupKey;
      previousGroupKey = row.groupKey;

      return `
        ${
          showGroupHeading
            ? `
              <div class="lb-game-group-heading">
                <span class="lb-game-group-icon" aria-hidden="true">🎮</span>
                <strong>${escapeHtml(getGameGroupHeading(row))}</strong>
              </div>
            `
            : ""
        }

        <div class="row row-game-all">
          <div class="rank">${row.rank}</div>

          <div class="player-cell">
            <strong>${escapeHtml(row.username)}</strong>
            <span>📍 ${escapeHtml(row.location)}</span>
          </div>

          <div class="score">${formatNumberOrDash(row.bestScore)}</div>

          <div class="time">${escapeHtml(row.timeDisplay)}</div>
        </div>
      `;
    })
    .join("");
}

function renderGameRows(rows) {
  if (gameSelect.value === "all") {
    return renderAllGamesRows(rows);
  }

  return rows
    .map(
      (row) => `
        <div class="row row-game">
          <div class="rank">${row.rank}</div>

          <div class="player-cell">
            <strong>${escapeHtml(row.username)}</strong>
            <span>📍 ${escapeHtml(row.location)}</span>
          </div>

          <div class="game-name">${escapeHtml(row.gameName)}</div>

          <div class="level-name">${escapeHtml(getLevelDisplay(row))}</div>

          <div class="score">${formatNumberOrDash(row.bestScore)}</div>

          <div class="time">${escapeHtml(row.timeDisplay)}</div>
        </div>
      `,
    )
    .join("");
}

function renderHistoryRows(rows) {
  return rows
    .map(
      (row) => `
        <div class="row row-history">
          <div class="history-date">${escapeHtml(formatDateTime(row.timestamp))}</div>

          <div class="game-name">${escapeHtml(getGameName(row))}</div>

          <div class="level-name">${escapeHtml(getLevelDisplay(row))}</div>

          <div class="score">${formatNumberOrDash(row.score)}</div>

          <div class="time">${escapeHtml(formatSeconds(row.timePlayed))}</div>

          <div class="result">
            <span class="lb-result-badge">${escapeHtml(
              row.meta?.result || "completed",
            )}</span>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderTable() {
  const data = state.leaderboardData;
  const total = data.length;
  const totalPageCount = Math.max(1, Math.ceil(total / state.perPage));

  if (state.currentPage > totalPageCount) {
    state.currentPage = totalPageCount;
  }

  const start = (state.currentPage - 1) * state.perPage;
  const pageRows = data.slice(start, start + state.perPage);

  leaderboardEmpty.hidden = total > 0;

  if (state.activeView === "overall") {
    leaderboard.innerHTML = renderOverallRows(pageRows);
  } else if (state.activeView === "game") {
    leaderboard.innerHTML = renderGameRows(pageRows);
  } else {
    leaderboard.innerHTML = renderHistoryRows(pageRows);
  }

  pageNum.textContent = String(state.currentPage);
  totalPages.textContent = String(totalPageCount);

  prevBtn.disabled = state.currentPage <= 1;
  nextBtn.disabled = state.currentPage >= totalPageCount;

  pagination.hidden = total <= state.perPage;
}

// =====================================================
// MY RANK
// =====================================================

function renderSignedOutRank() {
  myRankSignedOut.hidden = false;
  myRankContent.hidden = true;
}

async function renderMyRank() {
  if (!state.currentUser) {
    renderSignedOutRank();
    return;
  }

  const profile = await getUserProfile(state.currentUser.uid);

  myRankSignedOut.hidden = true;
  myRankContent.hidden = false;

  myRankAvatar.textContent = getInitials(profile.name);
  myRankName.textContent = profile.name;
  myRankEmail.textContent = maskEmail(state.currentUser.email);

  let row = null;
  let contextValue = "—";
  let contextLabel = "Ranked Games";
  let scoreLabel = "Overall Score";
  let hint = "";
  let usingOverallRank = false;

  if (state.activeView === "overall" || gameSelect.value === "all") {
    usingOverallRank = true;
    const overallRows =
      state.activeView === "overall"
        ? state.leaderboardData
        : await generateOverallLeaderboard(state.currentRawData);

    row = overallRows.find((item) => item.uid === state.currentUser.uid) || null;

    if (row) {
      contextValue = row.gamesCount;
    }

    if (state.activeView !== "overall") {
      hint = "Showing your Overall rank. Select one game and level for a game-specific rank.";
    }
  } else if (state.activeView === "game") {
    const knownLevels = state.levelOptionsCache.get(gameSelect.value) || [];

    if (knownLevels.length > 0 && levelSelect.value === "all") {
      row = null;
      contextValue = "—";
      contextLabel = "Level";
      scoreLabel = "Best Score";
      hint = "Select a level to see your rank for that specific level.";
    } else {
      row =
        state.leaderboardData.find(
          (item) => item.uid === state.currentUser.uid,
        ) || null;

      contextValue =
        levelSelect.value === "all"
          ? "-"
          : levelSelect.options[levelSelect.selectedIndex]?.text || "-";
      contextLabel = "Level";
      scoreLabel = "Best Score";
    }
  } else {
    const overallRows = await generateOverallLeaderboard(
      state.allTimeGlobalHistory,
    );

    row = overallRows.find((item) => item.uid === state.currentUser.uid) || null;

    if (row) {
      contextValue = row.gamesCount;
    }

    hint = "History shows every saved attempt, including repeat plays.";
  }

  if (!row) {
    myRankPosition.textContent = "—";
    myRankScore.textContent = "—";
  } else {
    myRankPosition.textContent = String(row.rank);

    if (getScoringSystem() === "totalTimePlayed" && state.activeView !== "history") {
      myRankScore.textContent = Number.isFinite(Number(row.totalTimePlayed))
        ? formatSeconds(row.totalTimePlayed)
        : "—";
      scoreLabel = "Time Played";
    } else {
      const scoreValue = usingOverallRank ? row.totalScore : row.bestScore;
      myRankScore.textContent = formatNumberOrDash(scoreValue);
    }
  }

  myRankScoreLabel.textContent = scoreLabel;
  myRankContext.textContent =
    contextValue === null || contextValue === undefined || contextValue === ""
      ? "—"
      : String(contextValue);
  myRankContextLabel.textContent = contextLabel;
  myRankHint.textContent = hint;
}

// =====================================================
// RECENT HISTORY SIDEBAR
// =====================================================

function renderRecentHistory() {
  if (!state.currentUser) {
    recentHistorySignedOut.hidden = false;
    recentHistoryList.innerHTML = "";
    return;
  }

  recentHistorySignedOut.hidden = true;

  const attempts = getRecentUserHistory();

  if (attempts.length === 0) {
    recentHistoryList.innerHTML = `
      <div class="lb-history-empty">
        No saved game attempts yet.
      </div>
    `;
    return;
  }

  recentHistoryList.innerHTML = attempts
    .map(
      (attempt) => `
        <article class="lb-history-preview-item">
          <div class="lb-history-preview-copy">
            <strong>${escapeHtml(getGameName(attempt))}</strong>
            ${
              hasLevel(attempt)
                ? `<span>${escapeHtml(getLevelDisplay(attempt))}</span>`
                : ""
            }
            <small>${escapeHtml(formatDateTime(attempt.timestamp))}</small>
          </div>

          <div class="lb-history-preview-score">
            ${formatNumberOrDash(attempt.score)}
          </div>
        </article>
      `,
    )
    .join("");
}

// =====================================================
// ADMIN CONTROLS
// =====================================================

function getSelectedAdminGame() {
  if (state.activeView === "overall" || gameSelect.value === "all") {
    return null;
  }

  return gameSelect.value;
}

async function syncAdminControls() {
  const gameId = getSelectedAdminGame();

  if (!gameId) {
    statusToggle.disabled = true;
    statusToggle.checked = false;
    resetBtn.disabled = true;
    adminContext.textContent =
      "Select one game to manage its competition settings.";
    resetHint.textContent = "";
    return;
  }

  statusToggle.disabled = false;
  resetBtn.disabled = false;

  const gameName = state.gameMap.get(gameId) || gameId;
  adminContext.textContent = `Managing: ${gameName}`;

  const gameSnap = await getDoc(doc(db, "leaderboards", gameId));

  statusToggle.checked =
    gameSnap.exists() && gameSnap.data().competitionIsActive === true;

  await checkResetEligibility();
}

async function checkResetEligibility() {
  const gameId = getSelectedAdminGame();

  if (!gameId) {
    resetBtn.disabled = true;
    resetHint.textContent = "";
    return;
  }

  const gameDoc = await getDoc(doc(db, "leaderboards", gameId));

  if (gameDoc.exists() && gameDoc.data().competitionIsActive === true) {
    resetBtn.disabled = true;
    resetHint.style.color = "#d30000";
    resetHint.textContent = "Competition active. Reset locked.";
  } else {
    resetBtn.disabled = false;
    resetHint.textContent = "";
  }
}

async function performReset(gameId) {
  const gameName = state.gameMap.get(gameId) || gameId;

  if (
    !confirm(
      `Are you sure you want to clear all score histories for ${gameName}?`,
    )
  ) {
    return;
  }

  const historyColRef = collection(db, "leaderboards", gameId, "gameHistory");
  const historySnapshot = await getDocs(historyColRef);

  if (historySnapshot.empty) {
    alert(`Score histories for ${gameName} are already empty.`);
    return;
  }

  const batch = writeBatch(db);

  historySnapshot.forEach((document) => {
    batch.delete(document.ref);
  });

  try {
    await batch.commit();

    state.levelOptionsCache.delete(gameId);

    alert(`Successfully reset ${gameName} histories.`);

    await refreshLevelOptions();
    await refreshData();
  } catch (error) {
    console.error("Reset failed:", error);
    alert("Error resetting leaderboard. Check console.");
  }
}

// =====================================================
// MAIN REFRESH
// =====================================================

async function refreshData() {
  updateViewControls();
  updateRangeDisplay();

  await fetchCurrentRawData();

  if (state.activeView === "overall") {
    state.leaderboardData = await generateOverallLeaderboard(
      state.currentRawData,
    );
  } else if (state.activeView === "game") {
    state.leaderboardData = await generateGameLeaderboard(
      state.currentRawData,
    );
  } else {
    state.leaderboardData = getCurrentUserHistory(state.currentRawData);
  }

  state.currentPage = 1;

  renderPodium();
  renderTable();
  await renderMyRank();
  renderRecentHistory();
  await syncAdminControls();
}

// =====================================================
// EVENTS
// =====================================================

document.querySelectorAll(".lb-view-tab").forEach((button) => {
  button.addEventListener("click", async () => {
    state.activeView = button.dataset.view || "overall";

    if (state.activeView === "overall") {
      gameSelect.value = "all";
      levelSelect.value = "all";
    } else {
      gameSelect.disabled = false;
      await refreshLevelOptions();
    }

    await refreshData();
  });
});

gameSelect.addEventListener("change", async () => {
  await refreshLevelOptions();
  await refreshData();
});

levelSelect.addEventListener("change", async () => {
  await refreshData();
});

seasonDate.addEventListener("input", async () => {
  await refreshData();
});

timeSelect.addEventListener("change", async () => {
  await refreshData();
});

document.getElementById("scoring").addEventListener("change", async () => {
  if (state.activeView === "overall") {
    state.leaderboardData = await generateOverallLeaderboard(
      state.currentRawData,
    );
  } else if (state.activeView === "game") {
    state.leaderboardData = await generateGameLeaderboard(
      state.currentRawData,
    );
  }

  state.currentPage = 1;

  renderPodium();
  renderTable();
  await renderMyRank();
});

prevBtn.addEventListener("click", () => {
  if (state.currentPage <= 1) return;

  state.currentPage -= 1;
  renderTable();
});

nextBtn.addEventListener("click", () => {
  const totalPageCount = Math.max(
    1,
    Math.ceil(state.leaderboardData.length / state.perPage),
  );

  if (state.currentPage >= totalPageCount) return;

  state.currentPage += 1;
  renderTable();
});

viewAllHistoryBtn.addEventListener("click", async () => {
  state.activeView = "history";

  document.querySelectorAll(".lb-view-tab").forEach((button) => {
    const isActive = button.dataset.view === "history";

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  await refreshLevelOptions();
  await refreshData();
});

statusToggle.addEventListener("change", async () => {
  const gameId = getSelectedAdminGame();

  if (!gameId) {
    statusToggle.checked = false;
    return;
  }

  const newState = statusToggle.checked;

  try {
    await setDoc(
      doc(db, "leaderboards", gameId),
      { competitionIsActive: newState },
      { merge: true },
    );

    await checkResetEligibility();
  } catch (error) {
    console.error("Update failed:", error);
    statusToggle.checked = !newState;
    alert("Database update failed.");
  }
});

resetBtn.addEventListener("click", async () => {
  const gameId = getSelectedAdminGame();

  if (!gameId) return;

  await performReset(gameId);
});

// =====================================================
// AUTH
// =====================================================

onAuthStateChanged(auth, async (user) => {
  state.currentUser = user || null;

  let isAdmin = false;

  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid, "private", "account");
      const userSnap = await getDoc(userDocRef);

      isAdmin = userSnap.exists() && userSnap.data().isAdmin === true;
    } catch (error) {
      console.error("Unable to get user role:", error);
    }
  }

  adminPanel.style.display = isAdmin ? "block" : "none";

  if (isAdmin && !state.legacyBp26LabelsMigrated) {
    try {
      const updateCount = await migrateLegacyBp26Labels();
      state.legacyBp26LabelsMigrated = true;

      if (updateCount > 0) {
        console.info(
          `[Leaderboard] Updated ${updateCount} legacy BP26 game label(s).`,
        );
      }
    } catch (error) {
      console.warn(
        "[Leaderboard] BP26 label migration could not be completed:",
        error,
      );
    }
  }

  const analyticsBtn = document.getElementById("analyticsBtn");

  if (analyticsBtn) {
    analyticsBtn.style.display = isAdmin ? "inline-flex" : "none";
  }

  await renderMyRank();
  renderRecentHistory();

  if (state.activeView === "history") {
    state.leaderboardData = getCurrentUserHistory(state.currentRawData);
    state.currentPage = 1;
    renderTable();
  }
});

// =====================================================
// SPARKLE PARTICLE SYSTEM
// =====================================================

const canvas = document.getElementById("sparkleCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let hoveredCard = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 6 + 1;
    this.speedX = (Math.random() - 0.5) * 3;
    this.speedY = (Math.random() - 0.5) * 3;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= this.decay;
    this.angle += this.spin;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color || "#3B82F6";
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

[1, 2, 3].forEach((rank) => {
  const element = document.getElementById(`card-${rank}`);

  if (!element) return;

  element.addEventListener("mouseenter", () => {
    hoveredCard = element;
  });

  element.addEventListener("mouseleave", () => {
    hoveredCard = null;
  });
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (hoveredCard) {
    const rect = hoveredCard.getBoundingClientRect();
    const color = hoveredCard.getAttribute("data-color");

    for (let i = 0; i < 2; i++) {
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;

      particles.push(new Particle(x, y, color));
    }
  }

  particles = particles.filter((particle) => {
    particle.update();
    particle.draw();

    return particle.alpha > 0;
  });

  requestAnimationFrame(animate);
}

// =====================================================
// INITIALIZE
// =====================================================

async function initializeLeaderboard() {
  try {
    await loadGameOptions();
    await loadAllTimeGlobalHistory();
    updateViewControls();
    await refreshData();
    animate();
  } catch (error) {
    console.error("[Leaderboard] Failed to initialize:", error);

    leaderboardEmpty.hidden = false;
    leaderboardEmpty.textContent =
      "The leaderboard could not be loaded. Please try again.";
  }
}

await initializeLeaderboard();
