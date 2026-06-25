const wordDatabase = [
    { word: "-ः (e.g., रामः)", translation: "Subject role / Singular base", case: "Prathamā" },
    { word: "-ेण (e.g., रामेण)", translation: "Instrumental / By or with", case: "Tṛtīyā" },
    { word: "-स्य (e.g., रामस्य)", translation: "Genitive / Belonging to (of)", case: "Ṣaṣṭhī" },
    { word: "-े (e.g., रामे)", translation: "Locative / Positioned inside (in/on)", case: "Saptamī" },
    { word: "-ाः (e.g., रामाः)", translation: "Plural subject form", case: "Prathamā" },
    { word: "-ैः (e.g., रामैः)", translation: "Plural instrumental / By means of", case: "Tṛtīyā" },
    { word: "-ाणाम् (e.g., रामाणाम्)", translation: "Plural genitive / Of them", case: "Ṣaṣṭhī" },
    { word: "-ेषु (e.g., रामेषु)", translation: "Plural locative / Among/In them", case: "Saptamī" }
];

let score = 0;
let streak = 0;
let highScore = localStorage.getItem("subanta_high_score") ? parseInt(localStorage.getItem("subanta_high_score")) : 0;
let currentWordIndex = 0;
let gameDeck = [];
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
    
    const flashcardElement = document.querySelector(".flashcard");
    flashcardElement.style.border = "2px solid #ef4444";
    flashcardElement.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.4)";
    playSound(false);

    setTimeout(() => {
        flashcardElement.style.border = "1px solid rgba(99, 102, 241, 0.2)";
        flashcardElement.style.boxShadow = "none";
        currentWordIndex++;
        loadNextWord();
    }, 600);
}

function shuffleDeck() {
    gameDeck = [...wordDatabase];
    for (let i = gameDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameDeck[i], gameDeck[j]] = [gameDeck[j], gameDeck[i]];
    }
}

function loadNextWord() {
    if (currentWordIndex >= gameDeck.length) {
        shuffleDeck();
        currentWordIndex = 0;
    }
    const currentQuestion = gameDeck[currentWordIndex];
    document.getElementById("sanskrit-word").innerText = currentQuestion.word;
    document.getElementById("word-meaning").innerText = currentQuestion.translation;
    startTimer();
}

function submitAnswer(chosenCase) {
    clearInterval(timerInterval);
    const currentQuestion = gameDeck[currentWordIndex];
    const flashcardElement = document.querySelector(".flashcard");

    flashcardElement.style.transition = "all 0.2s ease";

    if (chosenCase === currentQuestion.case) {
        score++;
        streak++;
        document.getElementById("score-counter").innerText = score;
        document.getElementById("streak-counter").innerText = streak;
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("subanta_high_score", highScore);
            document.getElementById("high-counter").innerText = highScore;
        }
        
        flashcardElement.style.border = "2px solid #10b981";
        flashcardElement.style.boxShadow = "0 0 20px rgba(16, 185, 129, 0.4)";
        playSound(true);
    } else {
        streak = 0;
        document.getElementById("streak-counter").innerText = streak;
        
        flashcardElement.style.border = "2px solid #ef4444";
        flashcardElement.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.4)";
        playSound(false);
    }

    setTimeout(() => {
        flashcardElement.style.border = "1px solid rgba(99, 102, 241, 0.2)";
        flashcardElement.style.boxShadow = "none";
        currentWordIndex++;
        loadNextWord();
    }, 600);
}

shuffleDeck();
loadNextWord();