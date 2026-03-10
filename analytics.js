import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { db } from "./auth/api/firebase-config.js";

const gameSelect = document.getElementById("gameSelect");
const timeSelect = document.getElementById("timeFilter");
let myChart = null;

// Get current month in YYYY-MM format
const timestamp = Date.now();
const date = new Date(timestamp);
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0"); // we gotta add one cause JAN is 0 in code but is 1 in firebase
const formattedDate = `${year}-${month}`;

// Helper to get YYYY-MM strings for current and previous months
function getMonthKeys() {
    const now = new Date();
    
    // Current Month
    const currYear = now.getFullYear();
    const currMonth = String(now.getMonth() + 1).padStart(2, "0");
    const currentKey = `${currYear}-${currMonth}`;

    // Previous Month
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevYear = prevDate.getFullYear();
    const prevMonth = String(prevDate.getMonth() + 1).padStart(2, "0");
    const previousKey = `${prevYear}-${prevMonth}`;

    return [previousKey, currentKey];
}

async function fetchGameHistories(selectedGame) {
    const [prevKey, currKey] = getMonthKeys();
    
    // Define document references
    const prevDocRef = doc(db, "leaderboards", selectedGame, "gameHistory", prevKey);
    const currDocRef = doc(db, "leaderboards", selectedGame, "gameHistory", currKey);

    // Fetch both in parallel for speed
    const [prevSnap, currSnap] = await Promise.all([
        getDoc(prevDocRef),
        getDoc(currDocRef)
    ]);

    // Merge entries from both documents
    const allEntries = {
        ...(prevSnap.exists() ? prevSnap.data().entries : {}),
        ...(currSnap.exists() ? currSnap.data().entries : {})
    };

    if (Object.keys(allEntries).length > 0) {
        const formattedData = Object.entries(allEntries).map(([key, score]) => {
            const [timestamp, uid] = key.split("_");
            return {
                uid,
                timestamp: Number(timestamp),
                score,
            };
        });
        
        console.log(`Analytics rawData: Merged ${prevKey} and ${currKey}`);
        return formattedData;
    }

    console.log("Analytics rawData: empty");
    return [];
}

function updateStats(counts, history, labels) {
    const total = counts.reduce((a, b) => a + b, 0); // just counts the number of entries
    const peak = Math.max(...counts);
    const peakIndex = counts.indexOf(peak);
    const peakTime = labels[peakIndex] || "N/A";
    
    // Unique players by UID
    const uniquePlayers = new Set(history.map(h => h.uid).filter(Boolean)).size;

    document.getElementById("stat-total").textContent = total.toLocaleString();
    document.getElementById("stat-peak").textContent = peak.toLocaleString();
    document.getElementById("stat-peak-time").textContent = `Peak games time at: ${peakTime}`; //Set text in peak time stat
    document.getElementById("stat-players").textContent = uniquePlayers.toLocaleString();
}

function updateAnalyticsChart(history, timeRange) {
    const canvas = document.getElementById("line-graph");
    if (!canvas) return;

    let steps = 7; // default set to weekly, has 7 steps
    if (timeRange === "daily") steps = 24; // 24 steps for daily
    else if (timeRange === "monthly") steps = 30; // 30 steps for monthly

    const labels = [];
    const counts = Array(steps).fill(0);
    const now = new Date();

    if (timeRange === "daily") {
        for (let i = steps - 1; i >= 0; i--) { //create labels for last 24 hours
            const d = new Date(now.getTime() - i * (60 * 60 * 1000));
            labels.push(d.toLocaleTimeString([], { hour: 'numeric' }));
        }
        history.forEach(({ timestamp }) => {
            const diff = Math.floor((now - timestamp) / (3600000)); // difference in hours
            if (diff >= 0 && diff < steps) counts[(steps - 1) - diff]++; // add to corresponding hour slot
        });
    } else { // weekly or monthly (both use days as steps so ill use same logic)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // set to start of today
        for (let i = steps - 1; i >= 0; i--) { //create labels for last days in time range (i)
            const d = new Date(today.getTime() - i * (86400000)); // go back (i) days
            labels.push(d.toLocaleDateString([], { month: 'short', day: 'numeric' }));
        }
        history.forEach(({ timestamp }) => {
            const d = new Date(timestamp);
            d.setHours(0, 0, 0, 0);
            const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
            if (diff >= 0 && diff < steps) counts[(steps - 1) - diff]++; // add to corresponding day slot | "(steps - 1) - diff" to reverse order
        });
    }

    updateStats(counts, history, labels); // Update stats display based on new data at the end

    if (myChart) myChart.destroy(); // Destroy previous chart if exists (some charts overlap ;-;)
    
    // Create new chart
    myChart = new Chart(canvas, { 
        type: "line",
        data: {
            labels,
            datasets: [{
                label: 'Plays',
                data: counts,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.05)",
                pointBackgroundColor: "#3b82f6",
                pointBorderColor: "#fff",
                pointHoverRadius: 6,
                borderWidth: 4,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 10 } },
            legend: { display: false },
            scales: {
                yAxes: [{
                    ticks: { beginAtZero: true, fontColor: '#94a3b8', maxTicksLimit: 5, padding: 10 },
                    gridLines: { color: '#f1f5f9', zeroLineColor: 'transparent' }
                }],
                xAxes: [{
                    ticks: { fontColor: '#94a3b8', padding: 10 },
                    gridLines: { display: false }
                }]
            },
            tooltips: {
                backgroundColor: '#1e293b',
                titleFontSize: 12,
                bodyFontSize: 14,
                xPadding: 12,
                yPadding: 12,
                displayColors: false,
                cornerRadius: 8
            }
        }
    });
}

// Startup
(async () => {
    const loadData = async () => {
        const histories = await fetchGameHistories(gameSelect.value || "Global");
        updateAnalyticsChart(histories, timeSelect.value);
    };

    gameSelect.addEventListener("change", loadData);
    timeSelect.addEventListener("change", loadData);

    await loadData();
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
})();