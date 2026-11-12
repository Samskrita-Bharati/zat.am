/* global canvas, ctx, loop, paintCircle,
   isIntersectingRectangleWithCircle, generateRandomNumber,
   paintParticles, createParticles, processParticles */

let score = 0;
let lives = 1;
let elapsedSeconds = 0;
let elapsedMilliseconds = 0;
let gameFinished = false;
let paused = false;
let submitting = false;
let submitted = false;
let letters = [];
let incorrectPresses = 0;

let previousTime = performance.now();

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: "#FF6347"
};

const letter = {
  font: "35px Monospace",
  color: "#0095DD",
  width: 24,
  height: 35,
  highestSpeed: 1.6,
  lowestSpeed: 0.6,
  probability: 0.02
};

const resultPanel = document.getElementById("resultPanel");
const resultTitle = document.getElementById("resultTitle");
const resultDetails = document.getElementById("resultDetails");
const scoreSaveStatus = document.getElementById("scoreSaveStatus");
const submitButton = document.getElementById("submitScoreButton");
const retryButton = document.getElementById("tryAgainButton");

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
window.addEventListener("resize", resizeHandler);

// Pause the game on switching tabs
document.addEventListener("visibilitychange", () => {
  if (document.hidden && !gameFinished) {
    paused = true;
  }

  previousTime = performance.now();
});

submitButton.addEventListener("click", submitScore);
retryButton.addEventListener("click", restart);

window.addEventListener("load", () => {
  initializeScoring();
});

function initializeScoring() {
  if (!window.zatamScore) return false;

  if (!window.zatamScore.getState().initialized) {
    window.zatamScore.init({
      gameId: "sankhya-typer",
      gameName: "Sankhya Typer"
    });
  }

  return true;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(remaining).padStart(2, "0")
  );
}

function updateScore() {
  score = Math.max(
    0,
    Math.min(100, elapsedSeconds - incorrectPresses * 2)
  );
}

function drawGame() {
  paintCircle(
    center.x,
    center.y,
    center.radius,
    center.color
  );

  ctx.font = letter.font;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = letter.color;

  for (const item of letters) {
    // Convert ASCII digits to Devanagari digits.
    const digit = String.fromCharCode(
      0x0966 + item.code - 48
    );

    ctx.fillText(digit, item.x, item.y);
  }

  paintParticles();

  ctx.font = canvas.width < 500
    ? "18px Arial"
    : "24px Arial";

  document.getElementById("scoreValue").textContent = score;
  document.getElementById("timerValue").textContent =
    formatTime(elapsedSeconds);
  document.getElementById("livesValue").textContent = lives;

  ctx.textAlign = "center";
  ctx.font = "16px Arial";
  ctx.fillStyle = "#444";

  ctx.fillText(
    "Esc / P: Pause",
    canvas.width / 2,
    canvas.height - 16
  );

  if (paused && !gameFinished) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#09264A";
    ctx.font = "24px Arial";
    ctx.fillText(
      "Paused — press Esc or P",
      canvas.width / 2,
      canvas.height / 2
    );
  }

  ctx.textAlign = "left";
}

loop(function (frames) {
  const now = performance.now();
  const delta = now - previousTime;
  previousTime = now;

  if (!paused && !gameFinished) {
    // Ignore long rendering gaps, consistent with canvas.js.
    if (delta < 300) {
      elapsedMilliseconds += delta;
    }

    elapsedMilliseconds = Math.min(
      elapsedMilliseconds,
      150000
    );

    elapsedSeconds = Math.floor(
      elapsedMilliseconds / 1000
    );

    updateScore();

    if (elapsedSeconds >= 150) {
    finishGame(true);
      } else {
      createLetters(frames);
      removeLetters(frames);
      processParticles(frames);
    }
  }

  drawGame();
});

function createLetters(frames) {
  // Keep spawning consistent across different screen refresh rates.
  for (let frame = 0; frame < frames; frame++) {
    if (Math.random() >= letter.probability) continue;

    const x = Math.random() < 0.5
      ? 0
      : canvas.width;

    const y = Math.random() * canvas.height;
    const dX = center.x - x;
    const dY = center.y - y;
    const distance = Math.hypot(dX, dY);

    const speed = generateRandomNumber(
      letter.lowestSpeed,
      letter.highestSpeed
    );

    letters.push({
      x,
      y,

      code: 48 + Math.floor(Math.random() * 10),

      speedX: (dX / distance) * speed,
      speedY: (dY / distance) * speed
    });
  }
}

function removeLetters(frames) {
  // Move and check one simulation step at a time so a slow rendering frame cannot move numbers through the ball.
  for (let frame = 0; frame < frames; frame++) {
    for (const item of letters) {
      item.x += item.speedX;
      item.y += item.speedY;

      ctx.font = letter.font;

      const digit = String.fromCharCode(
        0x0966 + item.code - 48
      );

      const width = ctx.measureText(digit).width;

      const collided = isIntersectingRectangleWithCircle(
        {
          x: item.x,
          y: item.y - letter.height
        },
        width,
        letter.height,
        center,
        center.radius
      );

      if (!collided) continue;

      lives--;

      // Clear the incoming numbers after losing a life.
      letters = [];
      createParticles(center.x, center.y);

      if (lives === 0) {
        finishGame(false);
      }

      return;
    }
  }
}

function keyDownHandler(event) {
  if (
    gameFinished ||
    paused ||
    event.repeat ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.target.closest(
      "input, textarea, select, button, [contenteditable]"
    )
  ) {
    return;
  }

  // Supports the number row, numpad, and Devanagari input.
  let digit;

  if (/^[0-9]$/.test(event.key)) {
    digit = Number(event.key);
  } else if (/^[०-९]$/.test(event.key)) {
    digit = event.key.charCodeAt(0) - 0x0966;
  } else {
    return;
  }

  event.preventDefault();

  const code = digit + 48;

  let targetIndex = -1;
  let nearestDistance = Infinity;

  letters.forEach((item, index) => {
    if (item.code !== code) return;

    const distance = Math.hypot(
      item.x - center.x,
      item.y - center.y
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      targetIndex = index;
    }
  });

  if (targetIndex !== -1) {
  const [item] = letters.splice(targetIndex, 1);
  createParticles(item.x, item.y);
  } else {
    incorrectPresses++;
    updateScore();
  }
}

function keyUpHandler(event) {
  if (
    gameFinished ||
    document.hidden ||
    event.target.closest(
      "input, textarea, select, button, [contenteditable]"
    )
  ) {
    return;
  }

  if (
    event.key === "Escape" ||
    event.key.toLowerCase() === "p"
  ) {
    paused = !paused;
    previousTime = performance.now();
  }
}

function finishGame(won) {
  if (gameFinished) return;

  gameFinished = true;
  letters = [];

  resultTitle.textContent = won
    ? "You survived!"
    : "Game Over";

  resultDetails.textContent =
    `Time survived: ${formatTime(elapsedSeconds)} · ` +
    `Score: ${score}/100`;

  scoreSaveStatus.textContent =
    "Click Submit Score to save this result.";

  resultPanel.hidden = false;
  submitButton.focus();
}

async function submitScore() {
  if (!gameFinished || submitting || submitted) return;

  if (!initializeScoring()) {
    scoreSaveStatus.textContent =
      "The leaderboard is unavailable. Please try again.";
    return;
  }

  submitting = true;
  submitButton.disabled = true;

  retryButton.disabled = true;

  scoreSaveStatus.textContent = "Saving your score...";

  try {
    const result = await window.zatamScore.submit(score, {
      result: elapsedSeconds >= 150 ? "completed" : "game-over",
      metrics: {
        elapsedSeconds,
        livesRemaining: lives,
        incorrectPresses,
        penaltyPoints: incorrectPresses * 2
      }
    });

    if (result.ok) {
      submitted = true;
      scoreSaveStatus.textContent =
        "Your score was saved to the leaderboard!";
    } else if (result.reason === "already-submitted") {
      submitted = true;
      scoreSaveStatus.textContent =
        "This attempt has already been submitted.";
    } else if (result.reason === "not-signed-in") {
      scoreSaveStatus.textContent =
        "Sign in to submit your score.";
    } else {
      scoreSaveStatus.textContent =
        "Your score could not be saved. Please try again.";
    }
  } catch (error) {
    console.error("Score submission failed:", error);

    scoreSaveStatus.textContent =
      "Your score could not be saved. Please try again.";
  } finally {
    submitting = false;
    submitButton.disabled = submitted;
    retryButton.disabled = false;
  }
}

function restart() {
  if (submitting) return;

  score = 0;
  lives = 1;
  elapsedSeconds = 0;
  elapsedMilliseconds = 0;
  incorrectPresses = 0;
  gameFinished = false;
  paused = false;
  submitted = false;
  letters = [];

  previousTime = performance.now();

  resultPanel.hidden = true;
  scoreSaveStatus.textContent = "";
  submitButton.disabled = false;
  submitButton.blur();
  retryButton.blur();

  if (initializeScoring()) {
    window.zatamScore.reset();
  }

  // The existing animation loop continues; don't start a second one.
}

function resizeHandler() {
  const oldWidth = canvas.width;
  const oldHeight = canvas.height;

  canvas.width = window.innerWidth;
  canvas.height = Math.max(800, window.innerHeight);

  center.x = canvas.width / 2;
  center.y = canvas.height / 2;

  for (const item of letters) {
    item.x *= canvas.width / oldWidth;
    item.y *= canvas.height / oldHeight;

    const dX = center.x - item.x;
    const dY = center.y - item.y;
    const distance = Math.hypot(dX, dY) || 1;
    const speed = Math.hypot(item.speedX, item.speedY);

    item.speedX = (dX / distance) * speed;
    item.speedY = (dY / distance) * speed;
  }
}