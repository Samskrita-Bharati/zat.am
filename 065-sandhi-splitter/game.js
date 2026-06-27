const sandhiDatabase = [
    { combined: "हिमालय", splitIndex: 2, leftTxt: "हिम", rightTxt: "आलय" },
    { combined: "तथैव", splitIndex: 2, leftTxt: "तथा", rightTxt: "एव" },
    { combined: "महोत्सव", splitIndex: 2, leftTxt: "महा", rightTxt: "उत्सव" },
    { combined: "इत्यादि", splitIndex: 2, leftTxt: "इति", rightTxt: "आदि" },
    { combined: "गणेश", splitIndex: 2, leftTxt: "गण", rightTxt: "ईश" }
];

let score = 0;
let streak = 0;
let highScore = localStorage.getItem("splitter_high_score") ? parseInt(localStorage.getItem("splitter_high_score")) : 0;
let currentPuzzle = null;
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
    setTimeout(loadRound, 800);
}

function loadRound() {
    document.getElementById("part-left").innerText = "?";
    document.getElementById("part-right").innerText = "?";
    
    const randomIndex = Math.floor(Math.random() * sandhiDatabase.length);
    currentPuzzle = sandhiDatabase[randomIndex];

    const sliceZone = document.getElementById("word-slice-zone");
    sliceZone.innerHTML = "";

    // Turn combined word into arrays of individual characters
    const chars = Array.from(currentPuzzle.combined);
    
    chars.forEach((char, index) => {
        const charSpan = document.createElement("span");
        charSpan.className = "slice-char";
        charSpan.innerText = char;
        sliceZone.appendChild(charSpan);

        // Put an interactive gap element between every single character
        if (index < chars.length - 1) {
            const gap = document.createElement("div");
            gap.className = "slice-gap";
            gap.onclick = () => performSplit(index + 1);
            sliceZone.appendChild(gap);
        }
    });

    startTimer();
}

function performSplit(chosenIndex) {
    clearInterval(timerInterval);

    document.getElementById("part-left").innerText = currentPuzzle.leftTxt;
    document.getElementById("part-right").innerText = currentPuzzle.rightTxt;

    if (chosenIndex === currentPuzzle.splitIndex) {
        score++;
        streak++;
        document.getElementById("score-counter").innerText = score;
        document.getElementById("streak-counter").innerText = streak;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("splitter_high_score", highScore);
            document.getElementById("high-counter").innerText = highScore;
        }
        playSound(true);
    } else {
        streak = 0;
        document.getElementById("streak-counter").innerText = streak;
        playSound(false);
    }

    setTimeout(loadRound, 1200);
}

loadRound();