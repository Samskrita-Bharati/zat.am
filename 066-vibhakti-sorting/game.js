const formsDatabase = [
    { text: "रामः (Rāmaḥ)", targetNumber: "Singular" },
    { text: "रामौ (Rāmau)", targetNumber: "Dual" },
    { text: "रामाः (Rāmāḥ)", targetNumber: "Plural" },
    { text: "रामम् (Rāmam)", targetNumber: "Singular" },
    { text: "रामेभ्यः (Rāmebhyaḥ)", targetNumber: "Plural" },
    { text: "रामयोः (Rāmayoḥ)", targetNumber: "Dual" },
    { text: "रामेण (Rāmeṇa)", targetNumber: "Singular" },
    { text: "रामाभ्याम् (Rāmābhyām)", targetNumber: "Dual" }
];

let score = 0;
let streak = 0;
let highScore = localStorage.getItem("sorting_high_score") ? parseInt(localStorage.getItem("sorting_high_score")) : 0;
let currentItem = null;
let timerInterval = null;
let timeLeft = 12;

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
    timeLeft = 12;
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
    setTimeout(spawnNextItem, 600);
}

function spawnNextItem() {
    const itemElement = document.getElementById("spawned-item");
    itemElement.style.transform = "scale(1)";
    itemElement.style.opacity = "1";

    const randomIndex = Math.floor(Math.random() * formsDatabase.length);
    currentItem = formsDatabase[randomIndex];

    itemElement.innerText = currentItem.text;
    startTimer();
}

function sortToBin(chosenNumber) {
    clearInterval(timerInterval);
    const itemElement = document.getElementById("spawned-item");

    if (chosenNumber === currentItem.targetNumber) {
        score++;
        streak++;
        document.getElementById("score-counter").innerText = score;
        document.getElementById("streak-counter").innerText = streak;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("sorting_high_score", highScore);
            document.getElementById("high-counter").innerText = highScore;
        }

        itemElement.style.transform = "translateY(50px) scale(0)";
        itemElement.style.opacity = "0";
        playSound(true);
    } else {
        streak = 0;
        document.getElementById("streak-counter").innerText = streak;
        itemElement.style.transform = "scale(1.2)";
        playSound(false);
    }

    setTimeout(spawnNextItem, 600);
}

spawnNextItem();