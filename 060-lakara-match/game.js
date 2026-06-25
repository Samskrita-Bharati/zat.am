const wordDatabase = [
    { word: "गच्छति", translation: "He goes", case: "Laṭ" },
    { word: "अगच्छत्", translation: "He went", case: "Laṅ" },
    { word: "गमिष्यति", translation: "He will go", case: "Lṛṭ" },
    { word: "गच्छतु", translation: "Let him go / Go!", case: "Loṭ" },
    { word: "पठति", translation: "He reads", case: "Laṭ" },
    { word: "अपठत्", translation: "He read", case: "Laṅ" },
    { word: "पठिष्यति", translation: "He will read", case: "Lṛṭ" },
    { word: "पठतु", translation: "Let him read", case: "Loṭ" },
    { word: "खादति", translation: "He eats", case: "Laṭ" },
    { word: "अखादत्", translation: "He ate", case: "Laṅ" },
    { word: "खादिष्यति", translation: "He will eat", case: "Lṛṭ" },
    { word: "खादतु", translation: "Let him eat / Eat!", case: "Loṭ" },
    { word: "लिखति", translation: "He writes", case: "Laṭ" },
    { word: "अलिखत्", translation: "He wrote", case: "Laṅ" },
    { word: "लेखिष्यति", translation: "He will write", case: "Lṛṭ" },
    { word: "लिखतु", translation: "Let him write / Write!", case: "Loṭ" },
    { word: "हसति", translation: "He laughs", case: "Laṭ" },
    { word: "अहसत्", translation: "He laughed", case: "Laṅ" },
    { word: "हसिष्यति", translation: "He will laugh", case: "Lṛṭ" },
    { word: "हसतु", translation: "Let him laugh", case: "Loṭ" },
    { word: "पिबति", translation: "He drinks", case: "Laṭ" },
    { word: "अपिबत्", translation: "He drank", case: "Laṅ" },
    { word: "पास्यति", translation: "He will drink", case: "Lṛṭ" },
    { word: "पिबतु", translation: "Let him drink", case: "Loṭ" }
];

let score = 0;
let streak = 0;
let currentWordIndex = 0;
let gameDeck = [];
let timerInterval = null;
let timeLeft = 10;

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