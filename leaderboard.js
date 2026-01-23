import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc, 
  getDoc, 
  writeBatch, 
  setDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwqOOawElTcsBIAmJQIkZYs-W-h8kJx7A",
  authDomain: "temporary-db-e9ace.firebaseapp.com",
  projectId: "temporary-db-e9ace",
  storageBucket: "temporary-db-e9ace.firebasestorage.app",
  messagingSenderId: "810939107125",
  appId: "1:810939107125:web:25edc649d354c1ca0bee7c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);

// filters
const gameSelect = document.getElementById("gameSelect");
const timeSelect = document.getElementById("timeFilter");

// fetches list of games
async function fetchGames() {
  const games = collection(db, "zat-am");
  const snapshot = await getDocs(games);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
}

// add all game leaderboards as options to the dropdown
const games = await fetchGames();
console.log(games);

if (games) {
  games.forEach((game) => {
    gameSelect.options.add(new Option(game.id, game.id));
    console.log(game.id);
  });
}

// fetch all game histories for selected game
async function fetchGameHistories(selectedGame) {
  const gameHistories = collection(db, "zat-am", selectedGame, "gameHistory");
  const snapshot = await getDocs(gameHistories);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(data);
  return data;
}

// generates usable leaderboard data from game histories
function generateLeaderboardData(gameHistories, timeRange) {
  const now = Date.now();

  const leaderboardData = Object.values(
    gameHistories.reduce((acc, { username, score, timestamp }) => {
      // time filtering
      if (
        (timeRange === "daily" && timestamp < now - 24 * 60 * 60 * 1000) ||
        (timeRange === "weekly" && timestamp < now - 7 * 24 * 60 * 60 * 1000) ||
        (timeRange === "monthly" && timestamp < now - 30 * 24 * 60 * 60 * 1000)
      ) {
        return acc;
      }

      if (!acc[username]) {
        acc[username] = {
          username,
          totalScore: 0,
          latestTimestamp: timestamp,
        };
      }

      acc[username].totalScore += score;

      if (timestamp > acc[username].latestTimestamp) {
        acc[username].latestTimestamp = timestamp;
      }

      return acc;
    }, {}),
  ).sort((a, b) => b.totalScore - a.totalScore);
  return leaderboardData;
}

// default leaderboard settings
let gameHistories = await fetchGameHistories("Global");
// empty time range means "All time"
let leaderboardData = generateLeaderboardData(gameHistories, ""); 

// upon game selection change, fetch game history for selected game,
// generate new leaderboard array,
// re-render leaderboard and change to 1st page
gameSelect.addEventListener("change", async (e) => {
  gameHistories = await fetchGameHistories(e.target.value);
  leaderboardData = generateLeaderboardData(gameHistories, "");
  render();
  changePage(1);

  // check reset button status
  checkResetEligibility(); 
  // sync toggle status
  syncToggleStatus(gameSelect.value);
});

// upon time range change, generate new leaderboard data,
// re-render leaderboard and change to 1st page
timeSelect.addEventListener("change", (e) => {
  leaderboardData = generateLeaderboardData(gameHistories, e.target.value);
  render();
  changePage(1);
})

let currentPage = 1;
const perPage = 10;

function render() {
  // Podium
  console.log(leaderboardData);
  for (let i = 0; i < 3; i++) {
    const player = leaderboardData[i];

    const username = document.getElementById("name-" + (i + 1));
    const score = document.getElementById("score-" + (i + 1));

    if (username) {
      username.textContent = player ? player.username : "---";
    } 
    if (score) {
      score.textContent = player ? player.totalScore.toLocaleString() : "---";
    }
  }

  // List
  const listData = leaderboardData.slice(3);
  const totalPages = Math.max(1, Math.ceil(listData.length / perPage));

  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * perPage;

  document.getElementById("leaderboard").innerHTML = listData
    .slice(start, start + perPage)
    .map(
      (p, i) => `
                    <div class="row">
                        <div class="rank">${start + i + 4}</div>
                        <div class="name">${p.username}</div>
                        <div class="score">${p.totalScore.toLocaleString()}</div>
                    </div>`,
    )
    .join("");

  document.getElementById("pageNum").textContent = currentPage;
  document.getElementById("totalPages").textContent = totalPages;

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

// change page
function changePage(page) {
  const totalPages = Math.ceil(leaderboardData.length / perPage);

  if (page < 1 || page > totalPages) return;
  currentPage = page;
  render();
}

document
  .getElementById("nextBtn")
  .addEventListener("click", () => changePage(currentPage + 1));
document
  .getElementById("prevBtn")
  .addEventListener("click", () => changePage(currentPage - 1));

render();
checkResetEligibility(); 


// --- chart.js --- orz
// WORK IN PROGRESS
const MS_IN_DAY = 24 * 60 * 60 * 1000;

function getLast7DaysLabels() {
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * MS_IN_DAY);
    labels.push(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    );
  }
  return labels;
}

function gamesLast7Days(history) {
  const counts = Array(7).fill(0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const { timestamp } of history) {
    const d = new Date(timestamp);
    d.setHours(0, 0, 0, 0);

    const diffDays = (today - d) / 86400000;

    if (diffDays >= 0 && diffDays < 7) {
      counts[6 - diffDays]++;
    }
  }

  return counts;
}

const gameHistoryData = gamesLast7Days(gameHistories);

let lineGraph = document.getElementById("line-graph");

const labels = getLast7DaysLabels();

// Options
const lineGrapOptions = {
  aspectRatio: 6,
  scales: {
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          beginAtZero: true,
          padding: 12,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          padding: 12,
        },
        gridLines: {
          display: false,
        },
      },
    ],
  },
  legend: {
    display: false,
  },
};
const myChart = new Chart(lineGraph, {
  type: "line",
  data: {
    labels,
    datasets: [
      {
        data: gameHistoryData,
        borderColor: "hsl(228, 70%, 60%)",
        pointBorderColor: "rgba(255,255,255,1)",
        pointBackgroundColor: "rgba(255,255,255,1)",
        borderWidth: 3,
        fill: true,
      },
    ],
  },
  options: lineGrapOptions,
});


// ============================================
// ====== Reset and Competition Controls ======
// ============================================

// For demo use, false for production
const mockIsAdmin = true;

// Visibility logic for adminPanel 
onAuthStateChanged(auth, async (user) => {
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;

  let isAdmin = false;

  if (user) {
    const idTokenResult = await user.getIdTokenResult();
    isAdmin = idTokenResult.claims?.admin === true;;
  }

  if (mockIsAdmin || isAdmin) {
    adminPanel.style.display = "block";
    checkResetEligibility();
    console.log("Admin Panel Shown (Mock/Real)");
  } else {
    adminPanel.style.display = "none";
    console.log("Admin Panel Hidden");
  }
});

// Check Competition status
const statusToggle = document.getElementById("statusToggle");
async function syncToggleStatus(game) {
  const statusToggle = document.getElementById("statusToggle");
  if (!game || game === "Global") {
    statusToggle.disabled = true; statusToggle.checked = false;
    return;
  }
  statusToggle.disabled = false;
  const gameSnap = await getDoc(doc(db, "zat-am", game));
  statusToggle.checked = gameSnap.exists() ? (gameSnap.data().competitionIsActive === true) : false;
}

document.getElementById("statusToggle").addEventListener("change", async (e) => {
  const gameId = document.getElementById("gameSelect").value;
  await setDoc(doc(db, "zat-am", gameId), { competitionIsActive: e.target.checked }, { merge: true });
  checkResetEligibility();
});


// Check reset button eligibility
async function checkResetEligibility() {
  const game = document.getElementById("gameSelect").value;
  const resetBtn = document.getElementById("resetBtn");
  const resetHint = document.getElementById("resetHint");

  if (!game || game === "Global") {
    resetBtn.disabled = false; resetBtn.style.background = ""; resetHint.textContent = "";
    return;
  }

  const gameDoc = await getDoc(doc(db, "zat-am", game));
  if (gameDoc.exists() && gameDoc.data().competitionIsActive) {
    resetBtn.disabled = true;
    resetBtn.style.background = "#ccc";
    resetHint.style.color = "#d30000";
    resetHint.textContent = "Competition active. Reset locked.";
  } else {
    resetBtn.disabled = false;
    resetBtn.style.background = "";
    resetHint.textContent = "";
  }
}

statusToggle.addEventListener("change", async () => {
    const gameId = document.getElementById("gameSelect").value;
    if (gameId === "Global") return;

    const newState = statusToggle.checked;
    try {
        const gameDocRef = doc(db, "zat-am", gameId);
        await setDoc(gameDocRef, { competitionIsActive: newState }, { merge: true });
        await checkResetEligibility();
    } catch (error) {
        console.error("Update failed:", error);
        statusToggle.checked = !newState;
        alert("Database update failed.");
    }
});


// Logic for leaderboard reset
async function performReset(game) {
  if (!confirm(`Are you sure you want to clear leaderboard for [${game}]?`)) return;

  const playersColRef = collection(db, "zat-am", game, "players");
  const historyColRef = collection(db, "zat-am", game, "gameHistory");
  const [playersSnapshot, historySnapshot] = await Promise.all([
    getDocs(playersColRef), getDocs(historyColRef)]);
  // const playersSnapshot = await getDocs(playersColRef);
  // const historySnapshot = await getDocs(historyColRef);

  if (playersSnapshot.empty && historySnapshot.empty) {
    alert("Leaderboard is already cleared.");
    return;
  }

  const batch = writeBatch(db);

  playersSnapshot.forEach((document) => {
    batch.delete(document.ref);
  });

  historySnapshot.forEach((document) => {
    batch.delete(document.ref);
  });

  try {
    await batch.commit();
    alert(`Successfully reset ${game} leaderboard.`);
    gameHistories = [];
    leaderboardData = generateLeaderboardData(gameHistories, "");
    render();
  } catch (error) {
    console.error("Reset failed: ", error);
    alert("Error resetting leaderboard. Check console.");
  }
}

document.getElementById("resetBtn").addEventListener("click", () => {
    const game = document.getElementById("gameSelect").value;
    performReset(game);
});