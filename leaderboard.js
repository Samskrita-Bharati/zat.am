import {
  query,
  collection,
  getDocs,
  doc, 
  getDoc, 
  writeBatch, 
  setDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { onAuthStateChanged } from "firebase/auth"
import { auth, db as roleCheckDb, leaderboardDb } from "./auth/api/firebase-config.js";

const timestamp = Date.now();
const date = new Date(timestamp);
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
// used for getting document for current month
const formattedDate = `${year}-${month}` // YYYY-MM

// filters
const gameSelect = document.getElementById("gameSelect");
const timeSelect = document.getElementById("timeFilter");
const seasonDate = document.getElementById("seasonDate");
const applyTimeBtn = document.getElementById("applyTimeBtn");

//let myChart = null;

// Apply button only available when 
// seasonDate and timeFilter are both valued
function validateApplyButton() {
    const hasDate = seasonDate.value.trim() !== "";
    const hasFilter = timeSelect.value.trim() !== "";

    applyTimeBtn.disabled = !(hasDate && hasFilter);
}
seasonDate.addEventListener("input", validateApplyButton);
timeSelect.addEventListener("change", validateApplyButton);

// Get the date range selected from HTML
function getFilterRange(mode, pickedDate) {

  const base = pickedDate ? new Date(pickedDate + "T00:00:00") : new Date();
  const pickedStart = new Date(base).setHours(0, 0, 0, 0);

  if (mode === "allDates") {
    //console.log("%c Range Filtered: ALL DATES", "color: blue; font-weight: bold;");
    return { start: 0, end: pickedStart + 86400000 - 1 };
  }

  let start = 0;
  let end = Infinity;

  switch (mode) {
    case "daily":
      start = pickedStart;
      end = pickedStart + 86400000 - 1; // 24小时
      break;
    case "weekly":
      // Get the day in week of selected day
      const day = base.getDay(); 
      
      // Get the monday date of selected week
      const sunday = new Date(base);
      sunday.setDate(base.getDate() - day); 
      start = sunday.setHours(0, 0, 0, 0);
      
      // Get the sunday date of selected week
      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);
      end = saturday.setHours(23, 59, 59, 999);
      break;
    case "monthly":
      // The 1st day to the last daye of selected month
      start = new Date(base.getFullYear(), base.getMonth(), 1).getTime();
      end = new Date(base.getFullYear(), base.getMonth() + 1, 1).getTime() - 1;
      break;
  }

  const sDate = new Date(start).toLocaleString();
  const eDate = new Date(end).toLocaleString();

  //console.log(`%c Range Filtered [${mode}]:`, "color: green; font-weight: bold;", `\nStart: ${sDate}\nEnd:   ${eDate}`);
  return { start, end };
}

applyTimeBtn.addEventListener("click", async () => {
    const mode = timeSelect.value;
    const dateValue = seasonDate.value;
    const selectedGame = gameSelect.value;

    // Get start and end date
    const { start, end } = getFilterRange(mode, dateValue);

    // Display filter range in HTML
    const displayEl = document.getElementById("filterRangeDisplay");
    if (mode === "allDates") {
        displayEl.innerText = "Showing: All Time Records";
    } else {
        const sStr = new Date(start).toLocaleDateString();
        const eStr = new Date(end).toLocaleDateString();
        displayEl.innerText = `Showing: ${sStr} — ${eStr}`;
    }

    // Generate leaderboard data with selected time range
    gameHistories = await fetchGameHistories(selectedGame, start, end);
    leaderboardData = await generateLeaderboardData(gameHistories, start, end);

    currentPage = 1;
    render();
    
});

// Get the months list(YYYY-MM) of selected time range
function getMonthsInRange(start, end) {
  const months = [];
  const current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, "0");
    months.push(`${y}-${m}`);
    
    current.setMonth(current.getMonth() + 1);
    current.setDate(1);
  }

  //console.log("Months to be fetched:", months)
  return months;
}


// fetch all game histories for selected game and the current month
async function fetchGameHistories(selectedGame, start, end) {
  const monthsList = getMonthsInRange(start, end);
  //console.log("Planned fetch months:", monthsList);
  
  const fetchPromises = monthsList.map(async (monthStr) => {
    const docRef = doc(leaderboardDb, "zat-am", selectedGame, "gameHistory", monthStr);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data().entries : null;
  });

  const allData = await Promise.all(fetchPromises);
  //console.log("Fetched allData:", allData)

  const formattedData = [];
  allData.forEach(monthEntries => {
    if (monthEntries) {
      Object.entries(monthEntries).forEach(([key, score]) => {
        const [timestamp, uid] = key.split("_");
        formattedData.push({
          uid,
          timestamp: Number(timestamp),
          score,
        });
      });
    }
  });

  //console.log("rawData:", formattedData)
  return formattedData
}

async function getUserProfile(uid) {
    const userDocRef = doc(roleCheckDb, "users", uid, "public", "profile");
    const userSnap = await getDoc(userDocRef);
    
    if (userSnap.exists()) {
        const data = userSnap.data();
        const location = (data.location || "").split(/[，,]/);
        return {
            name: data.name || "Unknown Player",
            location: location[location.length - 1].trim() || "Unknown"
        };
    }
    return { name: "Unknown Player", location: "Unknown" };
}

// generates usable leaderboard data from game histories
async function generateLeaderboardData(gameHistories, start, end) {
  const leaderboardData = Object.values(
    gameHistories.reduce((acc, { score, timestamp, uid }) => {
      // time filtering
      if (!timestamp || timestamp < start || timestamp > end) {
        return acc;
      }

      // use playerUID as key 
      const key = uid;
      if (!key) return acc; 

      if (!acc[key]) {
        acc[key] = {
          uid: key,
          totalScore: 0,
          latestTimestamp: timestamp,
        };
      }

      acc[key].totalScore += score;
      if (timestamp >= acc[key].latestTimestamp) {
        acc[key].latestTimestamp = timestamp;
      }

      return acc;
    }, {}),
  ).sort((a, b) => b.totalScore - a.totalScore);
  //console.log("dataWithoutNames:", leaderboardData);

  // associate names and locations with each uid
  const userCache = {};
  const dataWithUserProfile = await Promise.all(leaderboardData.map(async (record) => {
    const uid = record.uid;
    if (!uid) return { ...record, username: "Unknown Player", location: "Unknown" };

    if (!userCache[uid]) {
      const profile = await getUserProfile(uid);
      userCache[uid] = profile;
    }

    return {
      ...record,
      username: userCache[uid].name,
      location: userCache[uid].location
    };
  }));

  //console.log("dataWithUserProfile:", dataWithUserProfile);
  return dataWithUserProfile;
}

// default leaderboard settings
let gameHistories = await fetchGameHistories("Global", date, date );
// empty time range means today's daily
const initialRange = getFilterRange("daily", ""); 
let leaderboardData = await generateLeaderboardData(gameHistories, initialRange.start, initialRange.end);

// upon game selection change, fetch game history for selected game,
// generate new leaderboard array,
// re-render leaderboard and change to 1st page
gameSelect.addEventListener("change", async (e) => {
  const { start, end } = getFilterRange(timeSelect.value, seasonDate.value);
  gameHistories = await fetchGameHistories(e.target.value, start, end);
  leaderboardData = await generateLeaderboardData(gameHistories, start, end);
  render();
  changePage(1);

  // check reset button status
  checkResetEligibility(); 
  // sync toggle status
  syncToggleStatus(gameSelect.value);
});

let currentPage = 1;
const perPage = 10;

function render() {
  // Podium
  for (let i = 0; i < 3; i++) {
    const player = leaderboardData[i];

    const username = document.getElementById("name-" + (i + 1));
    const location = document.getElementById("location-" + (i + 1));
    const score = document.getElementById("score-" + (i + 1));

    if (username) {
      username.textContent = player ? player.username : "---";
    } 
    if (location) {
      location.textContent = player ? `📍 ${player.location}` : "---";
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
                        <div class="name" style="display: flex; align-items: center; gap: 3em;">
                            <span style="overflow: hidden; text-overflow: ellipsis; 
                                        white-space: nowrap; width: 200px;">${p.username}</span>
                            <span>📍 ${p.location}</span>
                        </div>
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
// check reset button status
checkResetEligibility(); 
// sync toggle status
syncToggleStatus(gameSelect.value);

// ============================================
// ====== Reset and Competition Controls ======
// ============================================

// // For demo use, false for production
// const mockIsAdmin = true;

// Visibility logic for adminPanel 
onAuthStateChanged(auth, async (user) => {

  //console.log("DEBUG - roleCheckDb:", roleCheckDb);

  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;

  let isAdmin = false;

  if (user) {
    //console.log("UID:", user.uid);
    try {
      const userDocRef = doc(roleCheckDb, "users", user.uid, "private", "account");
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        isAdmin = userData.isAdmin === true;
        //console.log("isAdmin:", isAdmin);
      }
      else {
        console.warn("User document not found in Firestore");
      }
    } catch (error) {
      console.error("unable to get user role:", error);
    }
  }

  // if (mockIsAdmin || isAdmin) {
  if (isAdmin) {
    adminPanel.style.display = "block";
    checkResetEligibility();
    //console.log("Admin Panel Shown");
  } else {
    adminPanel.style.display = "none";
    //console.log("Admin Panel Hidden");
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
  const gameSnap = await getDoc(doc(leaderboardDb, "zat-am", game));
  statusToggle.checked = gameSnap.exists() 
                      ? (gameSnap.data().competitionIsActive === true) : false;
}

document.getElementById("statusToggle").addEventListener("change", async (e) => {
  const gameId = document.getElementById("gameSelect").value;
  await setDoc(doc(leaderboardDb, "zat-am", gameId), 
                  { competitionIsActive: e.target.checked }, { merge: true });
  checkResetEligibility();
});


// Check reset button eligibility
async function checkResetEligibility() {
  const game = document.getElementById("gameSelect").value;
  const resetBtn = document.getElementById("resetBtn");
  const resetHint = document.getElementById("resetHint");

  if (!game || game === "Global") {
    resetBtn.disabled = false; 
    resetBtn.style.background = ""; 
    resetHint.textContent = "";
    return;
  }

  const gameDoc = await getDoc(doc(leaderboardDb, "zat-am", game));
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
        const gameDocRef = doc(leaderboardDb, "zat-am", gameId);
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
  if (!confirm(`Are you sure you want to clear all the score histories for ${game} ?`)) return;

  const historyColRef = collection(leaderboardDb, "zat-am", game, "gameHistory");
  const historySnapshot = await getDocs(historyColRef);

  if (historySnapshot.empty) {
    alert(`Score histories for ${game} are cleared.`);
    return;
  }

  const batch = writeBatch(leaderboardDb);

  historySnapshot.forEach((document) => {
    batch.delete(document.ref);
  });

  try {
    await batch.commit();
    alert(`Successfully reset ${game} histories.`);
    gameHistories = [];
    const { start, end } = getFilterRange(timeSelect.value, seasonDate.value);
    leaderboardData = await generateLeaderboardData(gameHistories, start, end);
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


// ============================================
// ====== SPARKLE PARTICLE SYSTEM ======
// ============================================
const canvas = document.getElementById('sparkleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let hoveredCard = null;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 15 + 1; //You can make the particles smaller/bigger/same size here by getting rid of random, or changing the nums to be smaller/bigger
        this.speedX = (Math.random() - 0.5) * 5;
        this.speedY = (Math.random() - 0.5) * 5;
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
        ctx.fillStyle = this.color || '#3B82F6';
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}

[1, 2, 3].forEach(rank => {
    const el = document.getElementById(`card-${rank}`);
    if(el) {
        el.addEventListener('mouseenter', () => hoveredCard = el);
        el.addEventListener('mouseleave', () => hoveredCard = null);
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (hoveredCard) {
        const rect = hoveredCard.getBoundingClientRect();
        const color = hoveredCard.getAttribute('data-color');
        for (let i = 0; i < 2; i++) {
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            particles.push(new Particle(x, y, color));
        }
    }
    particles = particles.filter(p => {
        p.update();
        p.draw();
        return p.alpha > 0;
    });
    requestAnimationFrame(animate);
}
animate();