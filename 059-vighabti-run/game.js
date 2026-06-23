const wordDatabase = [
    { word: "रामः", translation: "Rama (subject)", case: "Prathamā" },
    { word: "गुरुम्", translation: "to the Guru", case: "Dvitīyā" },
    { word: "रामेण", translation: "by/with Rama", case: "Tṛtīyā" },
    { word: "रामाय", translation: "for Rama", case: "Caturthī" },
    { word: "हरिः", translation: "Hari (subject)", case: "Prathamā" },
    { word: "कविम्", translation: "to the poet", case: "Dvitīyā" },
    { word: "नद्यै", translation: "for the river", case: "Caturthī" },
    { word: "देवेन", translation: "by/with the god", case: "Tṛtīyā" },
    { word: "बालकः", translation: "The boy (subject)", case: "Prathamā" },
    { word: "पुस्तकम्र", translation: "to the book", case: "Dvitīyā" }
];

let score = 0;
let streak = 0;
let currentWordIndex = 0;
let gameDeck = [];

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
}

function submitAnswer(chosenCase) {
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