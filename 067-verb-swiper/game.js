const verbDatabase = [
    { text: "भवति", tense: "left" }, 
    { text: "अभवत्", tense: "right" }, 
    { text: "पठति", tense: "left" }, 
    { text: "अपठत्", tense: "right" }, 
    { text: "गच्छति", tense: "left" }, 
    { text: "अगच्छत्", tense: "right" }, 
    { text: "लिखति", tense: "left" }, 
    { text: "अलिखत्", tense: "right" }
];

let score = 0;
let streak = 0;
let highScore = localStorage.getItem("swiper_high_score") ? parseInt(localStorage.getItem("swiper_high_score")) : 0;
let currentVerb = null;
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
    playSound(false);
    loadNextCard();
}

function loadNextCard() {
    const card = document.getElementById("swipe-card");
    card.style.transform = "translateX(0) rotate(0deg) scale(1)";
    card.style.opacity = "1";
    card.style.borderColor = "#475569";

    const randomIndex = Math.floor(Math.random() * verbDatabase.length);
    currentVerb = verbDatabase[randomIndex];
    card.innerText = currentVerb.text;

    startTimer();
}

function handleSwipe(direction) {
    clearInterval(timerInterval);
    const card = document.getElementById("swipe-card");
    const shiftX = direction === "left" ? -300 : 300;
    
    card.style.transform = `translateX(${shiftX}px) rotate(${shiftX / 10}deg)`;
    card.style.opacity = "0";

    if (direction === currentVerb.tense) {
        score++;
        streak++;
        document.getElementById("score-counter").innerText = score;
        document.getElementById("streak-counter").innerText = streak;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("swiper_high_score", highScore);
            document.getElementById("high-counter").innerText = highScore;
        }
        playSound(true);
    } else {
        streak = 0;
        document.getElementById("streak-counter").innerText = streak;
        playSound(false);
    }

    setTimeout(loadNextCard, 400);
}

// Intercept physical keyboard arrow keys for swiping action
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") handleSwipe("left");
    if (e.key === "ArrowRight") handleSwipe("right");
});

loadNextCard();