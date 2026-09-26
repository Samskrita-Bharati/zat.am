const puzzleDatabase = [
    { prompt: "He goes", answer: ["ग", "च्छ", "ति"] },
    { prompt: "He reads", answer: ["प", "ठ", "ति"] },
    { prompt: "God is everywhere", answer: ["ई", "श्व", "रः"] },
    { prompt: "He writes", answer: ["लि", "ख", "ति"] },
    { prompt: "Today", answer: ["अ", "द्य"] }
];

let score = 0;
let streak = 0;
let highScore = localStorage.getItem("builder_high_score") ? parseInt(localStorage.getItem("builder_high_score")) : 0;
let currentQuestion = null;
let currentInput = [];
let usedTileIndices = [];
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
    document.getElementById("player-input-view").style.borderColor = "#ef4444";
    playSound(false);
    setTimeout(loadRound, 800);
}

function loadRound() {
    currentInput = [];
    usedTileIndices = [];
    
    const inputView = document.getElementById("player-input-view");
    inputView.innerText = "";
    inputView.style.borderColor = "#475569";

    const randomIndex = Math.floor(Math.random() * puzzleDatabase.length);
    currentQuestion = puzzleDatabase[randomIndex];

    document.getElementById("target-prompt").innerText = currentQuestion.prompt;

    // Standard pool of absolute filler letters to avoid easy elimination
    const fillers = ["म", "पु", "नः", "लो", "रा", "म्"];
    let letterPool = [...currentQuestion.answer, ...fillers].slice(0, 10);
    
    // Fallback ensure true characters are present
    currentQuestion.answer.forEach(char => {
        if (!letterPool.includes(char)) {
            letterPool.push(char);
        }
    });

    letterPool.sort(() => 0.5 - Math.random());

    const bankContainer = document.getElementById("letter-bank");
    bankContainer.innerHTML = "";

    letterPool.forEach((char, index) => {
        const button = document.createElement("button");
        button.className = "letter-tile";
        button.innerText = char;
        button.onclick = () => selectLetter(char, index, button);
        bankContainer.appendChild(button);
    });

    startTimer();
}

function selectLetter(char, index, buttonElement) {
    currentInput.push(char);
    usedTileIndices.push(index);
    buttonElement.classList.add("used");
    
    document.getElementById("player-input-view").innerText = currentInput.join("");
}

function clearInput() {
    currentInput = [];
    usedTileIndices = [];
    document.getElementById("player-input-view").innerText = "";
    
    const tiles = document.querySelectorAll(".letter-tile");
    tiles.forEach(tile => tile.classList.remove("used"));
}

function submitWord() {
    clearInterval(timerInterval);
    const playerString = currentInput.join("");
    const targetString = currentQuestion.answer.join("");
    const inputView = document.getElementById("player-input-view");

    if (playerString === targetString) {
        score++;
        streak++;
        document.getElementById("score-counter").innerText = score;
        document.getElementById("streak-counter").innerText = streak;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("builder_high_score", highScore);
            document.getElementById("high-counter").innerText = highScore;
        }

        inputView.style.borderColor = "#10b981";
        playSound(true);
    } else {
        streak = 0;
        document.getElementById("streak-counter").innerText = streak;
        inputView.style.borderColor = "#ef4444";
        playSound(false);
    }

    setTimeout(loadRound, 800);
}

loadRound();