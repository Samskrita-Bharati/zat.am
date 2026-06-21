const wordDatabase = [
    { word: "रामः", translation: "Rama (subject)", case: "Prathamā" },
    { word: "गुरुम्", translation: "to the Guru", case: "Dvitīyā" },
    { word: "रामेण", translation: "by/with Rama", case: "Tṛtīyā" },
    { word: "रामाय", translation: "for Rama", case: "Caturthī" },
    { word: "हरिः", translation: "Hari (subject)", case: "Prathamā" },
    { word: "कविम्", translation: "to the poet", case: "Dvitīyā" }
];

let score = 0;
let currentWordIndex = 0;

function loadNextWord() {
    if (currentWordIndex >= wordDatabase.length) {
        document.querySelector(".game-container").innerHTML = `
            <div class="flashcard">
                <h1 style="color: #10b981;">Run Complete!</h1>
                <p style="font-size: 1.3rem; margin-top: 10px;">Final Score: <strong>${score} / ${wordDatabase.length}</strong></p>
            </div>
        `;
        return;
    }
    const currentQuestion = wordDatabase[currentWordIndex];
    document.getElementById("sanskrit-word").innerText = currentQuestion.word;
    document.getElementById("word-meaning").innerText = currentQuestion.translation;
}

function submitAnswer(chosenCase) {
    const currentQuestion = wordDatabase[currentWordIndex];
    const flashcardElement = document.querySelector(".flashcard");

    flashcardElement.style.transition = "all 0.2s ease";

    if (chosenCase === currentQuestion.case) {
        score++;
        document.getElementById("score-counter").innerText = score;
        flashcardElement.style.border = "2px solid #10b981";
        flashcardElement.style.boxShadow = "0 0 20px rgba(16, 185, 129, 0.4)";
    } else {
        flashcardElement.style.border = "2px solid #ef4444";
        flashcardElement.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.4)";
    }

    setTimeout(() => {
        flashcardElement.style.border = "1px solid rgba(99, 102, 241, 0.2)";
        flashcardElement.style.boxShadow = "none";
        currentWordIndex++;
        loadNextWord();
    }, 600);
}

loadNextWord();