import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwqOOawElTcsBIAmJQIkZYs-W-h8kJx7A",
  authDomain: "temporary-db-e9ace.firebaseapp.com",
  projectId: "temporary-db-e9ace",
  storageBucket: "temporary-db-e9ace.firebasestorage.app",
  messagingSenderId: "810939107125",
  appId: "1:810939107125:web:25edc649d354c1ca0bee7c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

const gameSelect = document.getElementById("gameSelect");
const timeSelect = document.getElementById("timeFilter");
let myChart = null;

async function fetchGames() {
    const gamesCol = collection(db, "zat-am");
    const snapshot = await getDocs(gamesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function fetchGameHistories(selectedGame) {
    const historyCol = collection(db, "zat-am", selectedGame, "gameHistory");
    const snapshot = await getDocs(historyCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

function updateStats(counts, history, labels) {
    const total = counts.reduce((a, b) => a + b, 0);
    const peak = Math.max(...counts);
    const peakIndex = counts.indexOf(peak);
    const peakTime = labels[peakIndex] || "N/A";
    
    // Unique players, use SET so we can filter duplicates; unique meaning different usernames; need to change later to u/uid
    const uniquePlayers = new Set(history.map(h => h.username)).size;

    document.getElementById("stat-total").textContent = total.toLocaleString();
    document.getElementById("stat-peak").textContent = peak.toLocaleString();
    document.getElementById("stat-peak-time").textContent = `Peak at: ${peakTime}`;
    document.getElementById("stat-players").textContent = uniquePlayers.toLocaleString();
}

function updateAnalyticsChart(history, timeRange) {
    const canvas = document.getElementById("line-graph");
    if (!canvas) return;

    let steps = 7;
    if (timeRange === "daily") steps = 24;
    else if (timeRange === "monthly") steps = 30;

    const labels = [];
    const counts = Array(steps).fill(0);
    const now = new Date();

    if (timeRange === "daily") {
        for (let i = steps - 1; i >= 0; i--) {
            const d = new Date(now.getTime() - i * (60 * 60 * 1000));
            labels.push(d.toLocaleTimeString([], { hour: 'numeric' }));
        }
        history.forEach(({ timestamp }) => {
            const diff = Math.floor((now - timestamp) / (3600000));
            if (diff >= 0 && diff < steps) counts[(steps - 1) - diff]++;
        });
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = steps - 1; i >= 0; i--) {
            const d = new Date(today.getTime() - i * (86400000));
            labels.push(d.toLocaleDateString([], { month: 'short', day: 'numeric' }));
        }
        history.forEach(({ timestamp }) => {
            const d = new Date(timestamp);
            d.setHours(0, 0, 0, 0);
            const diff = Math.floor((today - d) / 86400000);
            if (diff >= 0 && diff < steps) counts[(steps - 1) - diff]++;
        });
    }

    updateStats(counts, history, labels);

    if (myChart) myChart.destroy();

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
    const games = await fetchGames();
    games.forEach(g => gameSelect.options.add(new Option(g.id, g.id)));
    
    const loadData = async () => {
        const histories = await fetchGameHistories(gameSelect.value || "Global");
        updateAnalyticsChart(histories, timeSelect.value);
    };

    gameSelect.addEventListener("change", loadData);
    timeSelect.addEventListener("change", loadData);

    await loadData();
})();