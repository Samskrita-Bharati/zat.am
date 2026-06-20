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
                <h1 style="color: #2e7d32;">Run Complete!</h1>
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
    if (chosenCase === currentQuestion.case) {
        score++;
        document.getElementById("score-counter").innerText = score;
        alert("Correct! उत्तमम्!");
    } else {
        alert(`Incorrect. The correct case was: ${currentQuestion.case}`);
    }
    currentWordIndex++;
    loadNextWord();
}

loadNextWord();