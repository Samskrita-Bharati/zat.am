const connectPairs = [
    { leftId: 1, leftText: "सः (He)", rightId: 1, rightText: "पठति (Reads)" },
    { leftId: 2, leftText: "त्वम् (You)", rightId: 2, rightText: "पठसि (Read)" },
    { leftId: 3, leftText: "अहम् (I)", rightId: 3, rightText: "पठामि (Read)" }
];

let score = 0;
let streak = 0;
let highScore = localStorage.getItem("connect_high_score") ? parseInt(localStorage.getItem("connect_high_score")) : 0;
let selectedLeftNode = null;
let matchesFound = 0;
let timerInterval = null;
let timeLeft = 15;

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
    timeLeft = 15;
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
    playSound(false);
    initBoard();
}

function initBoard() {
    selectedLeftNode = null;
    matchesFound = 0;

    const leftCol = document.getElementById("left-column");
    const rightCol = document.getElementById("right-column");
    
    leftCol.innerHTML = "";
    rightCol.innerHTML = "";

    // Generate random shuffles for individual columns
    const shuffledLeft = [...connectPairs].sort(() => 0.5 - Math.random());
    const shuffledRight = [...connectPairs].sort(() => 0.5 - Math.random());

    shuffledLeft.forEach(pair => {
        const div = document.createElement("div");
        div.className = "node";
        div.innerText = pair.leftText;
        div.dataset.id = pair.leftId;
        div.onclick = () => selectLeft(div);
        leftCol.appendChild(div);
    });

    shuffledRight.forEach(pair => {
        const div = document.createElement("div");
        div.className = "node";
        div.innerText = pair.rightText;
        div.dataset.id = pair.rightId;
        div.onclick = () => selectRight(div);
        rightCol.appendChild(div);
    });

    startTimer();
}

function selectLeft(element) {
    // Remove previous selection highlight
    const previous = document.querySelector("#left-column .node.selected");
    if (previous) previous.classList.remove("selected");

    selectedLeftNode = element;
    element.classList.add("selected");
}

function selectRight(element) {
    if (!selectedLeftNode) return; // Must pick left column first

    if (selectedLeftNode.dataset.id === element.dataset.id) {
        selectedLeftNode.classList.remove("selected");
        selectedLeftNode.classList.add("matched");
        element.classList.add("matched");
        
        selectedLeftNode = null;
        matchesFound++;
        playSound(true);

        if (matchesFound === connectPairs.length) {
            clearInterval(timerInterval);
            score++;
            streak++;
            document.getElementById("score-counter").innerText = score;
            document.getElementById("streak-counter").innerText = streak;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("connect_high_score", highScore);
                document.getElementById("high-counter").innerText = highScore;
            }
            setTimeout(initBoard, 800);
        }
    } else {
        streak = 0;
        document.getElementById("streak-counter").innerText = streak;
        selectedLeftNode.classList.remove("selected");
        selectedLeftNode = null;
        playSound(false);
        
        // Brief visual flash error state
        element.style.borderColor = "#ef4444";
        setTimeout(() => element.style.borderColor = "#475569", 400);
    }
}

initBoard();