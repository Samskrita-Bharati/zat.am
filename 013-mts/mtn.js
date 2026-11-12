
/* =========================================
   013-MTS — MATCH THE NUMBERS
   Zat.am Integration
   ========================================= */

/* global createButtonGroup, createModalButton,
          createModal, keyUpHandler, Sanscript */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const defaultRows = 3;
const defaultCols = 3;
const defaultMinDigit = 0;
const defaultMaxDigit = 1;
const defaultMoveType = true;
const defaultIncrease = true;

let rows = defaultRows;
let cols = defaultCols;
let minDigit = defaultMinDigit;
let maxDigit = defaultMaxDigit;
let moveType = defaultMoveType;
let increase = defaultIncrease;

let index = 0;
let labels = [];

/* =========================================
   GAME TRACKING
   ========================================= */

let moves = 0;
let seconds = 0;
let gameFinished = false;
let timerInterval = null;
let timerStarted = false;

const scoreValue = document.getElementById("scoreValue");
const timerValue = document.getElementById("timerValue");
const movesValue = document.getElementById("movesValue");
const resultPanel = document.getElementById("resultPanel");
const finalScore = document.getElementById("finalScore");
const resultDetails = document.getElementById("resultDetails");
const scoreSaveStatus = document.getElementById("scoreSaveStatus");

/* =========================================
   CANVAS SETTINGS
   ========================================= */

const label = {
  height: 38,
  font: "bold 38px Arial",
  paddingX: 18,
  paddingY: 12,
  color: "#09264A",
  selectedColor: "#F16945"
};

let charWidth;
let charHeight;

/* =========================================
   EXISTING SETTINGS BUTTONS
   ========================================= */

const modalElements = [
  [
    ["Rows", "rows", 2, 99, "number"],
    ["Min Digit", "min", 0, 8, "number"],
    ['<u>C</u>hange <span id="moveText">target</span> digit',
      "move", "c", "check"]
  ],
  [
    ["Columns", "cols", 2, 99, "number"],
    ["Max Digit", "max", 1, 9, "number"],
    ['<span id="increaseText">Increase</span> <u>d</u>igit',
      "increase", "d", "check"]
  ]
];

const buttonElements = [
  ["info", "restart()", "r", "sync", "<u>R</u>estart"],
  ["info", "", "s", "cog", "<u>S</u>ettings"],
  ["info", 'window.open("mts_ins2.html","_blank");',
    "h", "help", "<u>H</u>elp"]
];

const buttonGroup = createButtonGroup(
  "btn-group btn-group-lg btn-group-center",
  buttonElements
);

document.body.insertBefore(
  createModalButton(buttonGroup, 1),
  document.querySelector("main")
);

createModal(modalElements);

// Move generated buttons into the game layout.
const generatedButtons = document.querySelector(".btn-group-center");

if (generatedButtons) {
  document.querySelector(".numbers-board-wrapper")
    .prepend(generatedButtons);
}

/* =========================================
   FIX SETTINGS BUTTON
   ========================================= */

const settingsButton = [...document.querySelectorAll("button, a")]
  .find(el => el.textContent.includes("Settings"));

if (settingsButton) {
  settingsButton.addEventListener("click", function(event) {
    event.preventDefault();

    $(".modal").modal("show");
  });
}

/* =========================================
   UI HELPERS
   ========================================= */

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const remaining = totalSeconds % 60;

  return String(minutes).padStart(2, "0") +
    ":" + String(remaining).padStart(2, "0");
}

function updateStats() {
  movesValue.textContent = moves;
  timerValue.textContent = formatTime(seconds);
}

function startTimer() {
  if (timerStarted || gameFinished) return;

  timerStarted = true;

  timerInterval = setInterval(() => {
    if (!gameFinished) {
      seconds++;
      updateStats();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTracking() {
  stopTimer();

  moves = 0;
  seconds = 0;
  timerStarted = false;
  gameFinished = false;

  scoreValue.textContent = "—";
  updateStats();

  resultPanel.classList.add("zatam-hidden");
  scoreSaveStatus.textContent = "";

  // A new attempt can be submitted after a restart.
  if (window.zatamScore?.getState().initialized) {
    window.zatamScore.reset();
  }
}

/* =========================================
   CANVAS SIZE
   ========================================= */

function resizeHandler() {
  const wrapper = document.querySelector(".numbers-board-wrapper");

  const availableWidth = wrapper.clientWidth;

  canvas.width = Math.max(200, Math.min(availableWidth, 900));
  canvas.height = Math.max(
    280,
    Math.min(520, window.innerHeight * 0.55)
  );

  const fontSize = canvas.width < 500 ? 28 : 38;

  label.height = fontSize;
  label.font = `bold ${fontSize}px Arial`;
  label.paddingX = fontSize * 0.5;
  label.paddingY = fontSize * 0.4;

  ctx.font = label.font;

  const metrics = ctx.measureText("०");

  charWidth = metrics.width + label.paddingX;
  charHeight = label.height + label.paddingY;

  // Keep the existing board centered when the window changes.
  positionLabels();
}

function positionLabels() {
  if (!labels.length) return;

  const marginX = (canvas.width - cols * charWidth) / 2;
  const marginY = (canvas.height - rows * charHeight) / 2;

  labels.forEach((item, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;

    item.x = col * charWidth + marginX;
    item.y = (row + 1) * charHeight + marginY;
  });
}

/* =========================================
   SETTINGS
   ========================================= */

function resetInputs() {
  rows = defaultRows;
  cols = defaultCols;
  minDigit = defaultMinDigit;
  maxDigit = defaultMaxDigit;
  moveType = defaultMoveType;
  increase = defaultIncrease;

  document.getElementById("rows").value = rows;
  document.getElementById("cols").value = cols;
  document.getElementById("min").value = minDigit;
  document.getElementById("max").value = maxDigit;
  document.getElementById("move").checked = moveType;
  document.getElementById("increase").checked = increase;
}

window.save = function() {
  const requestedRows = Number(document.getElementById("rows").value);
  const requestedCols = Number(document.getElementById("cols").value);
  const requestedMin = Number(document.getElementById("min").value);
  const requestedMax = Number(document.getElementById("max").value);

  const nextMin = Math.max(0, Math.min(8, Math.trunc(requestedMin)));
  const nextMax = Math.max(1, Math.min(9, Math.trunc(requestedMax)));

  if (
    !Number.isFinite(requestedRows) ||
    !Number.isFinite(requestedCols) ||
    !Number.isFinite(requestedMin) ||
    !Number.isFinite(requestedMax) ||
    nextMax <= nextMin
  ) {
    window.alert("Please choose valid settings with Max Digit greater than Min Digit.");
    return;
  }

  minDigit = nextMin;
  maxDigit = nextMax;

  rows = Math.max(
    2,
    Math.min(Math.trunc(requestedRows), Math.floor(canvas.height / charHeight))
  );

  cols = Math.max(
    2,
    Math.min(Math.trunc(requestedCols), Math.floor(canvas.width / charWidth))
  );

  restart();
};

/* =========================================
   GAME INITIALIZATION
   ========================================= */

function restart() {
  resetTracking();

  index = 0;
  labels = [];

  for (let i = 0; i < rows * cols; i++) {
    labels.push({
      x: 0,
      y: 0,
      code: Math.floor(
        Math.random() * (maxDigit - minDigit + 1)
      ) + minDigit + 48,
      color: label.color
    });
  }

  // Avoid starting with an already completed board.
  if (labels.every(l => l.code === labels[0].code)) {
    labels[labels.length - 1].code =
      (labels[0].code === maxDigit + 48)
        ? minDigit + 48
        : maxDigit + 48;
  }

  labels[index].color = label.selectedColor;
  positionLabels();
}

window.restart = restart;

/* =========================================
   DRAW GAME
   ========================================= */

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = label.font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const item of labels) {
    ctx.fillStyle = item.color;

    const digit = String.fromCharCode(item.code);
    const sanskritDigit = Sanscript.t(
      digit, "itrans", "devanagari"
    );

    ctx.fillText(
      sanskritDigit,
      item.x + charWidth / 2,
      item.y - charHeight / 2
    );
  }

  requestAnimationFrame(draw);
}

/* =========================================
   MOVEMENT
   ========================================= */

function movePlayer(direction) {
  if (gameFinished) return;

  const old = index;
  let next = index;

  if (direction === "ArrowUp" && index >= cols) {
    next -= cols;
  }

  if (direction === "ArrowDown" && index < labels.length - cols) {
    next += cols;
  }

  if (direction === "ArrowLeft" && index % cols !== 0) {
    next--;
  }

  if (direction === "ArrowRight" && index % cols !== cols - 1) {
    next++;
  }

  if (next === old) return;

  startTimer();

  index = next;
  moves++;

  const changedIndex = moveType ? next : old;
  const changedLabel = labels[changedIndex];

  if (increase) {
    changedLabel.code =
      changedLabel.code === maxDigit + 48
        ? minDigit + 48
        : changedLabel.code + 1;
  } else {
    changedLabel.code =
      changedLabel.code === minDigit + 48
        ? maxDigit + 48
        : changedLabel.code - 1;
  }

  labels[old].color = label.color;
  labels[index].color = label.selectedColor;

  updateStats();

  checkCompletion();
}

/* =========================================
   SCORE CALCULATION
   ========================================= */

function calculateScore(elapsedSeconds, totalMoves) {
  const minuteBracket = Math.floor(elapsedSeconds / 60);

  // No points after 10 minutes
  if (minuteBracket >= 10) {
    return 0;
  }

  // Starts with100, goes down by 10 every minute
  const baseScore = 100 - minuteBracket * 10;

  // Start with 30 moves, goes up by 20 every minute
  const moveLimit = 30 + minuteBracket * 20;

  // Deduct 5 points if the player exceeds the move limit
  const movePenalty = totalMoves > moveLimit ? 5 : 0;

  return Math.max(0, baseScore - movePenalty);
}

/* =========================================
   COMPLETION
   ========================================= */

function checkCompletion() {
  const target = increase
    ? maxDigit + 48
    : minDigit + 48;

  const complete = labels.every(
    item => item.code === target
  );

  if (complete) {
    finishGame();
  }
}

async function finishGame() {
  if (gameFinished) return;

  gameFinished = true;
  stopTimer();

  const score = calculateScore(seconds, moves);

  scoreValue.textContent = score;
  finalScore.textContent = score;

  resultDetails.textContent =
    `You completed the puzzle in ${moves} moves ` +
    `and ${formatTime(seconds)}!`;

  resultPanel.classList.remove("zatam-hidden");

  scoreSaveStatus.className =
    "zatam-game-status zatam-game-status-info";

  scoreSaveStatus.textContent = "Saving your score...";

  if (!window.zatamScore) {
    scoreSaveStatus.textContent =
      `Scoring system unavailable. Your local result is ${score}.`;
    return;
  }

  try {
    const result = await window.zatamScore.submit(score, {
      metrics: {
        moves: moves,
        elapsedSeconds: seconds,
        rows: rows,
        columns: cols,
        minDigit: minDigit,
        maxDigit: maxDigit
      }
    });

    if (result.ok) {
      scoreSaveStatus.className =
        "zatam-game-status zatam-game-status-success";

      scoreSaveStatus.textContent =
        "Your score was saved to the leaderboard!";
    } else if (result.reason === "not-signed-in") {
      scoreSaveStatus.textContent =
        "You completed the game! Log in to save future scores.";
    } else if (result.reason === "already-submitted") {
      scoreSaveStatus.textContent =
        "This attempt has already been submitted.";
    } else {
      scoreSaveStatus.textContent =
        "Your result was recorded locally, but not saved online.";
    }
  } catch (error) {
    console.error("Score submission failed:", error);

    scoreSaveStatus.className =
      "zatam-game-status zatam-game-status-error";

    scoreSaveStatus.textContent =
      "Unable to save your score. Please try again later.";
  }
}

/* =========================================
   KEYBOARD AND MOBILE CONTROLS
   ========================================= */

function keyDownHandler_(event) {
  
  if (
    event.target.closest(
      "input, textarea, select, [contenteditable='true']"
    )
  ) {
    return;
  }
  const directions = [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
  ];

  if (directions.includes(event.key)) {
    event.preventDefault();
    movePlayer(event.key);
  }
}

document.addEventListener("keydown", keyDownHandler_);

document.addEventListener("keyup", keyUpHandler);

document.querySelectorAll("[data-direction]").forEach(button => {
  button.addEventListener("click", () => {
    movePlayer(button.dataset.direction);
  });
});

document.getElementById("playAgainBtn")
  .addEventListener("click", restart);

document.getElementById("move")
  .addEventListener("change", function() {
    moveType = this.checked;

    document.getElementById("moveText").textContent =
      moveType ? "target" : "source";

    restart();
  });

document.getElementById("increase")
  .addEventListener("change", function() {
    increase = this.checked;

    document.getElementById("increaseText").textContent =
      increase ? "Increase" : "Decrease";

    restart();
  });

window.addEventListener("resize", resizeHandler);

/* =========================================
   START
   ========================================= */

resetInputs();
resizeHandler();
restart();
draw();
