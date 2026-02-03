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

let myChart = null;

// fetch all game histories for selected game and the current month
async function fetchGameHistories(selectedGame) {
  const gameHistories = doc(leaderboardDb, "zat-am", selectedGame, "gameHistory", formattedDate);
  const snapshot = await getDoc(gameHistories);
  const data = snapshot.data()

  if (data) {
    const formattedData = Object.entries(data.entries).map(([key, score]) => {
      const [timestamp, uid] = key.split("_");

      return {
        uid,
        timestamp: Number(timestamp),
        score,
      };
    });
    console.log("rawData:", formattedData)
    return formattedData
  }

  console.log("rawData:", [])
  return [];
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

function isToday(timestamp) {
  const now = new Date();
  const d = new Date(timestamp);

  if (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  ) {
  }

  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isThisWeek(timestamp) {
  const now = new Date();
  const d = new Date(timestamp);

  // start of this week (local time)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // start of the week for the given timestamp
  const startOfTimestampWeek = new Date(d);
  startOfTimestampWeek.setDate(d.getDate() - d.getDay());
  startOfTimestampWeek.setHours(0, 0, 0, 0);

  return startOfWeek.getTime() === startOfTimestampWeek.getTime();
}

function isThisMonth(timestamp) {
  const now = new Date();
  const d = new Date(timestamp);

  if (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth()
  ) {
  }

  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth()
  );
}

// generates usable leaderboard data from game histories
async function generateLeaderboardData(gameHistories, timeRange) {
  const leaderboardData = Object.values(
    gameHistories.reduce((acc, { score, timestamp, uid }) => {
      // time filtering
      if (
        (timeRange === "daily" && !isToday(timestamp)) ||
        (timeRange === "weekly" && !isThisWeek(timestamp)) ||
        (timeRange === "monthly" && !isThisMonth(timestamp))
      ) {
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
let gameHistories = await fetchGameHistories("Global");
// empty time range means "All time"
let leaderboardData = await generateLeaderboardData(gameHistories, "daily"); 
updateAnalyticsChart(gameHistories, "daily");

// upon game selection change, fetch game history for selected game,
// generate new leaderboard array,
// re-render leaderboard and change to 1st page
gameSelect.addEventListener("change", async (e) => {
  gameHistories = await fetchGameHistories(e.target.value);
  leaderboardData = await generateLeaderboardData(gameHistories, timeSelect.value);
  render();
  changePage(1);

  // check reset button status
  checkResetEligibility(); 
  // sync toggle status
  syncToggleStatus(gameSelect.value);
  updateAnalyticsChart(gameHistories, timeSelect.value); // !!!!!!! reset chart to all time, maybe change later idk
});

// upon time range change, generate new leaderboard data,
// re-render leaderboard and change to 1st page
timeSelect.addEventListener("change", async (e) => {
  leaderboardData = await generateLeaderboardData(gameHistories, e.target.value);
  render();
  changePage(1);
  updateAnalyticsChart(gameHistories, e.target.value)
})

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


// --- ANALYTICS CHART LOGIC (I remade it) ---
function updateAnalyticsChart(history, timeRange) {
    const canvas = document.getElementById("line-graph");
    if (!canvas) return;

    // Determine number of steps and label formatting based on time filter
    let steps = 7; // Default for "All Time" and Weekly
    let formatOptions = { month: "short", day: "numeric" };
    
    if (timeRange === "daily") {
        steps = 24; // Show hours
        formatOptions = { hour: 'numeric', minute: '2-digit' };
    } else if (timeRange === "monthly") {
        steps = 30; // Last 30 days
    }

    const labels = [];
    const counts = Array(steps).fill(0);
    const now = new Date();

    if (timeRange === "daily") {
        // Daily: Last 24 hours
        for (let i = steps - 1; i >= 0; i--) {
            const d = new Date(now.getTime() - i * (60 * 60 * 1000));
            labels.push(d.toLocaleTimeString("en-US", { hour: 'numeric', hour12: true }));
        }

        history.forEach(({ timestamp }) => {
            const diffHours = Math.floor((now - timestamp) / (60 * 60 * 1000));
            if (diffHours >= 0 && diffHours < steps) {
                counts[(steps - 1) - diffHours]++;
            }
        });
    } else {
        // Weekly or Monthly: Days
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = steps - 1; i >= 0; i--) {
            const d = new Date(today.getTime() - i * (24 * 60 * 60 * 1000));
            labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
        }

        history.forEach(({ timestamp }) => {
            const d = new Date(timestamp);
            d.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((today - d) / (24 * 60 * 60 * 1000));
            if (diffDays >= 0 && diffDays < steps) {
                counts[(steps - 1) - diffDays]++;
            }
        });
    }

    if (myChart) {
        myChart.destroy();
    } // Destroy previous chart cause it was spawning a bunch of them, make a new one

    myChart = new Chart(canvas, { //designing the chart
        type: "line",
        data: {
            labels,
            datasets: [{
                label: 'Games Played',
                data: counts,
                borderColor: "hsl(228, 70%, 60%)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                pointBorderColor: "rgba(255,255,255,1)",
                pointBackgroundColor: "rgba(59, 130, 246, 1)",
                borderWidth: 3,
                fill: true,
                tension: 0.3
            }],
        },
        options: {
            aspectRatio: 3,
            scales: {
                yAxes: [{ 
                    ticks: { beginAtZero: true, stepSize: 1 },
                    scaleLabel: { display: true, labelString: 'Games Played' }
                }],
                xAxes: [{ 
                    gridLines: { display: false },
                    ticks: { maxTicksLimit: steps > 10 ? 10 : steps }
                }]
            },
            legend: { display: false },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        return ` Games Played: ${tooltipItem.yLabel}`;
                    }
                }
            }
        }
    });
}

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
  if (!confirm(`Are you sure you want to clear leaderboard for [${game}]?`)) return;

  const historyColRef = collection(db, "zat-am", game, "gameHistory");
  const historySnapshot = await getDocs(historyColRef);

  if (historySnapshot.empty) {
    alert("Leaderboard is cleared.");
    return;
  }

  const batch = writeBatch(leaderboardDb);

  historySnapshot.forEach((document) => {
    batch.delete(document.ref);
  });

  try {
    await batch.commit();
    alert(`Successfully reset ${game} leaderboard.`);
    gameHistories = [];
    leaderboardData = await generateLeaderboardData(gameHistories, "");
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