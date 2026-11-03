const modeButtons = document.querySelectorAll(".mode-button");
const gameFrame = document.getElementById("game-frame");
const characterSetSelect = document.getElementById("character-set-select");
const scoreDisplay = document.getElementById("game-score");
const timeDisplay = document.getElementById("game-time");
const errorsDisplay = document.getElementById("game-errors");
const scoreConfig = window.ANVESHAN_SCORE_CONFIG;
const requestedSet = Number.parseInt(new URLSearchParams(window.location.search).get("s"), 10);
let gameSet = Number.isInteger(requestedSet) && requestedSet >= 0 && requestedSet < nums.length
  ? requestedSet
  : 0;

nums.forEach((characters, index) => {
  const option = document.createElement("option");
  option.value = String(index);
  option.textContent = characters.join(" ");
  characterSetSelect.appendChild(option);
});
characterSetSelect.value = String(gameSet);

function gameUrl(src, set = gameSet) {
  const url = new URL(src, window.location.href);
  url.searchParams.set("s", String(set));
  return url.href;
}

// Pass the selected character set from the menu page into the embedded game.
gameFrame.src = gameUrl(gameFrame.getAttribute("src"));

characterSetSelect.addEventListener("change", () => {
  gameSet = Number.parseInt(characterSetSelect.value, 10);
  const nextPageUrl = new URL(window.location.href);
  nextPageUrl.searchParams.set("s", String(gameSet));
  window.history.replaceState(null, "", nextPageUrl);
  resetStats();
  window.zatamScore?.reset?.();
  gameFrame.src = gameUrl(gameFrame.src);
});

function calculateScore(found, errors) {
  const liveScore = found * scoreConfig.pointsPerFind - errors * scoreConfig.penaltyPerError;
  return Math.min(
    scoreConfig.maximumScore,
    Math.max(scoreConfig.minimumScore, liveScore),
  );
}

function calculateScoreBreakdown(found, errors, elapsedSeconds) {
  const tierIndex = scoreConfig.timeBonusThresholdsSeconds.findIndex(
    (threshold) => elapsedSeconds < threshold,
  );
  const timeBonus = tierIndex === -1 ? 0 : scoreConfig.timeBonusPoints[tierIndex] ?? 0;
  const baseScore = found * scoreConfig.pointsPerFind;
  const errorDeduction = errors * scoreConfig.penaltyPerError;
  const unboundedScore = baseScore - errorDeduction + timeBonus;
  const score = Math.min(
    scoreConfig.maximumScore,
    Math.max(scoreConfig.minimumScore, unboundedScore),
  );
  const scoreCapDeduction = Math.max(0, unboundedScore - scoreConfig.maximumScore);
  const scoreFloorAdjustment = Math.max(0, scoreConfig.minimumScore - unboundedScore);

  return { baseScore, errorDeduction, timeBonus, scoreCapDeduction, scoreFloorAdjustment, score };
}

function resetStats() {
  scoreDisplay.textContent = "0";
  timeDisplay.textContent = "00:00";
  errorsDisplay.textContent = "0";
}

gameFrame.addEventListener("load", resetStats);

const completionModal = document.getElementById("completion-modal");

function showCompletion(data) {
  const found = Number(data.found ?? 0);
  const errors = Number(data.errors ?? 0);
  const elapsedSeconds = Number(data.elapsedSeconds ?? 0);
  const { baseScore, errorDeduction, timeBonus, scoreCapDeduction, scoreFloorAdjustment, score } = calculateScoreBreakdown(
    found,
    errors,
    elapsedSeconds,
  );

  document.getElementById("result-correct").textContent = `+${baseScore}`;
  document.getElementById("result-errors").textContent = `−${errorDeduction}`;
  document.getElementById("result-time-bonus").textContent = `+${timeBonus}`;
  document.getElementById("result-cap-row").hidden = scoreCapDeduction === 0;
  document.getElementById("result-cap").textContent = `−${scoreCapDeduction}`;
  document.getElementById("result-floor-row").hidden = scoreFloorAdjustment === 0;
  document.getElementById("result-floor").textContent = `+${scoreFloorAdjustment}`;
  document.getElementById("result-score").textContent = String(score);
  completionModal.hidden = false;
  submitLeaderboardScore(score, {
    correctFinds: found,
    incorrectClicks: errors,
    baseScore,
    errorDeduction,
    timeBonus,
    scoreCapDeduction,
    scoreFloorAdjustment,
    pointsEarned: score,
    gameTimerSeconds: elapsedSeconds,
  });
}

async function submitLeaderboardScore(score, metrics) {
  const status = document.getElementById("score-save-status");
  status.hidden = false;
  status.className = "zatam-game-status zatam-game-status-info";
  status.textContent = "Saving your score...";

  if (!window.zatamScore || typeof window.zatamScore.submit !== "function") {
    status.className = "zatam-game-status zatam-game-status-error";
    status.textContent = "The leaderboard is not available right now.";
    return;
  }

  try {
    const leaderboardScore = window.zatamScore.clampScore
      ? window.zatamScore.clampScore(score)
      : Math.max(0, Math.min(100, Math.round(score)));
    const result = await window.zatamScore.submit(leaderboardScore, { metrics });
    if (result?.ok) {
      status.className = "zatam-game-status zatam-game-status-success";
      status.textContent = "Score saved to the leaderboard ✓";
    } else if (result?.reason === "not-signed-in") {
      status.className = "zatam-game-status zatam-game-status-info";
      status.textContent = "Sign in to save your score to the leaderboard.";
    } else if (result?.reason === "already-submitted") {
      status.className = "zatam-game-status zatam-game-status-success";
      status.textContent = "Score already saved ✓";
    } else {
      status.className = "zatam-game-status zatam-game-status-error";
      status.textContent = "Your score could not be saved.";
    }
  } catch (error) {
    console.error("[021-a] Score submission failed:", error);
    status.className = "zatam-game-status zatam-game-status-error";
    status.textContent = "The leaderboard score could not be saved.";
  }
}

document.getElementById("play-again").addEventListener("click", () => {
  completionModal.hidden = true;
  window.zatamScore?.reset?.();
  gameFrame.src = gameFrame.src;
});

window.addEventListener("message", (event) => {
  if (event.source !== gameFrame.contentWindow) return;
  if (event.data?.type === "anveshan-complete") {
    showCompletion(event.data);
    return;
  }
  if (event.data?.type !== "anveshan-stats") return;
  timeDisplay.textContent = String(event.data.time ?? "00:00");
  errorsDisplay.textContent = String(event.data.errors ?? 0);
  scoreDisplay.textContent = String(calculateScore(
    Number(event.data.found ?? 0),
    Number(event.data.errors ?? 0),
  ));
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((modeButton) => {
      const isSelected = modeButton === button;
      modeButton.setAttribute("aria-pressed", String(isSelected));
      modeButton.classList.toggle("zatam-game-btn-primary", isSelected);
      modeButton.classList.toggle("zatam-game-btn-secondary", !isSelected);
    });

    resetStats();
    window.zatamScore?.reset?.();
    gameFrame.src = gameUrl(button.dataset.src);
    gameFrame.title = `${button.dataset.name} mode`;
  });
});
