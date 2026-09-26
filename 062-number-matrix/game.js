const numberDatabase = [
    { name: "एकम्", value: 1 },
    { name: "द्वे", value: 2 },
    { name: "त्रीणि", value: 3 },
    { name: "चत्वारि", value: 4 },
    { name: "पञ्च", value: 5 },
    { name: "षट्", value: 6 },
    { name: "सप्त", value: 7 },
    { name: "अष्ट", value: 8 },
    { name: "नव", value: 9 },
    { name: "दश", value: 10 }
];

let score = 0;
let streak = 0;
let highScore = localStorage.getItem("matrix_high_score") ? parseInt(localStorage.getItem("matrix_high_score")) : 0;
let currentTarget = null;
let timerInterval = null;
let timeLeft = 10;

document.getElementById("high-counter").innerText = highScore;

function playSound(isCorrect) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (isCorrect) {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); 
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); 
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.25);
    } else {
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    document.getElementById("timer-display").innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer-display").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    streak = 0;
    document.getElementById("streak-counter").innerText = streak;
    flashGrid("#ef4444");
    playSound(false);
    setTimeout(generateRound, 600);
}

function generateRound() {
    const shuffled = [...numberDatabase].sort(() => 0.5 - Math.random());
    currentTarget = shuffled[0];
    
    document.getElementById("target-word").innerText = currentTarget.name;

    const gridPool = shuffled.slice(0, 9).sort(() => 0.5 - Math.random());
    
    if (!gridPool.some(item => item.value === currentTarget.value)) {
        gridPool[Math.floor(Math.random() * 9)] = currentTarget;
    }

    const gridContainer = document.getElementById("number-grid");
    gridContainer.innerHTML = "";

    gridPool.forEach(item => {
        const button = document.createElement("button");
        button.className = "tile-btn";
        button.innerText = item.value;
        button.onclick = () => selectTile(item.value, button);
        gridContainer.appendChild(button);
    });

    startTimer();
}

function selectTile(selectedValue, clickedButton) {
    clearInterval(timerInterval);

    if (selectedValue === currentTarget.value) {
        score++;
        streak++;
        document.getElementById("score-counter").innerText = score;
        document.getElementById("streak-counter").innerText = streak;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("matrix_high_score", highScore);
            document.getElementById("high-counter").innerText = highScore;
        }

        clickedButton.style.backgroundColor = "#10b981";
        clickedButton.style.borderColor = "#10b981";
        playSound(true);
    } else {
        streak = 0;
        document.getElementById("streak-counter").innerText = streak;
        clickedButton.style.backgroundColor = "#ef4444";
        clickedButton.style.borderColor = "#ef4444";
        playSound(false);
    }

    setTimeout(generateRound, 600);
}

function flashGrid(color) {
    const buttons = document.querySelectorAll(".tile-btn");
    buttons.forEach(btn => {
        btn.style.borderColor = color;
        btn.style.backgroundColor = color + "22";
    });
}

generateRound();