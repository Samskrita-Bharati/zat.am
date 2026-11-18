const sentenceDatabase = [
    { sentence: "अहं ____ गच्छामि ।", translation: "I am going today.", answer: "अद्य (Today)", distractors: ["श्वः (Tomorrow)", "सदा (Always)", "कुत्र (Where)"] },
    { sentence: "ईश्वरः ____ अस्ति ।", translation: "God is everywhere.", answer: "सर्वत्र (Everywhere)", distractors: ["अत्र (Here)", "तत्र (There)", "कदा (When)"] },
    { sentence: "त्वं ____ गच्छसि ?", translation: "Where are you going?", answer: "कुत्र (Where)", distractors: ["यत्र (Where/relative)", "सहसा (Suddenly)", "श्वः (Tomorrow)"] },
    { sentence: "सः ____ सत्यं वदति ।", translation: "He always speaks the truth.", answer: "सदा (Always)", distractors: ["अद्य (Today)", "वृथा (In vain)", "कदापि (Ever)"] },
    { sentence: "रामायणं ____ अभवत् ।", translation: "The Ramayana happened long ago.", answer: "पुरा (Long ago)", distractors: ["अधुना (Now)", "श्वः (Tomorrow)", "इव (Like)"] }
];

let score = 0;
let streak = 0;
let highScore = localStorage.getItem("connector_high_score") ? parseInt(localStorage.getItem("connector_high_score")) : 0;
let currentQuestion = null;
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
    playSound(false);
    setTimeout(loadNextRound, 600);
}

function loadNextRound() {
    const flashcardElement = document.querySelector(".flashcard");
    flashcardElement.style.border = "1px solid rgba(99, 102, 241, 0.2)";
    
    const randomIndex = Math.floor(Math.random() * sentenceDatabase.length);
    currentQuestion = sentenceDatabase[randomIndex];

    document.getElementById("sanskrit-sentence").innerText = currentQuestion.sentence;
    document.getElementById("english-translation").innerText = currentQuestion.translation;

    const choices = [currentQuestion.answer, ...currentQuestion.distractors].sort(() => 0.5 - Math.random());
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    choices.forEach(choice => {
        const button = document.createElement("button");
        button.className = "bin-btn";
        button.innerText = choice;
        button.onclick = () => checkAnswer(choice, button);
        optionsContainer.appendChild(button);
    });

    startTimer();
}

function checkAnswer(selectedChoice, clickedButton) {
    clearInterval(timerInterval);
    const flashcardElement = document.querySelector(".flashcard");

    if (selectedChoice === currentQuestion.answer) {
        score++;
        streak++;
        document.getElementById("score-counter").innerText = score;
        document.getElementById("streak-counter").innerText = streak;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("connector_high_score", highScore);
            document.getElementById("high-counter").innerText = highScore;
        }

        flashcardElement.style.border = "2px solid #10b981";
        clickedButton.style.backgroundColor = "#10b981";
        playSound(true);
    } else {
        streak = 0;
        document.getElementById("streak-counter").innerText = streak;
        flashcardElement.style.border = "2px solid #ef4444";
        clickedButton.style.backgroundColor = "#ef4444";
        playSound(false);
    }

    setTimeout(loadNextRound, 600);
}

loadNextRound();