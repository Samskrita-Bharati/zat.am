/* Adapted from https://github.com/codepo8/letterpaint */
(async function () {
  "use strict";

  var container = document.getElementById("container");
  var canvas = document.getElementById("paint-canvas");
  var context = canvas.getContext("2d", { willReadFrequently: true });
  var response = await fetch("letters.json");
  if (!response.ok) throw new Error("Could not load letters.json");
  var config = await response.json();
  if (!Array.isArray(config.letters) || !config.letters.length ||
      config.letters.some(function (value) { return typeof value !== "string" || !value.trim(); }) ||
      new Set(config.letters).size !== config.letters.length) {
    throw new Error("Invalid vowel list in letters.json");
  }
  var chars = config.letters;
  if (!config.levelIds || chars.some(function (vowel) {
    return typeof config.levelIds[vowel] !== "string" || !config.levelIds[vowel].trim();
  }) || new Set(chars.map(function (vowel) { return config.levelIds[vowel]; })).size !== chars.length) {
    throw new Error("Each vowel needs a unique, stable level ID in letters.json");
  }
  var scoreApi = null;
  var scoreApiError = "";
  try {
    scoreApi = await import("../js/game-score.js");
    if (typeof scoreApi.initGameScore !== "function" || typeof scoreApi.submitGameScore !== "function") {
      throw new Error("Shared scoring is unavailable");
    }
  } catch (scoreError) {
    scoreApi = null;
    console.warn("[Vowel Paint] Could not load shared scoring.", scoreError);
    scoreApiError = "We couldn’t connect to the leaderboard. Your result is still available here.";
  }
  var intro = document.getElementById("intro");
  var win = document.getElementById("win");
  var error = document.getElementById("error");
  var soundButton = document.getElementById("sound");
  var reloadButton = document.getElementById("reload");
  var winSound = document.getElementById("winsound");

  var state = "intro";
  var letter = null;
  var sound = true;
  var activePointer = null;
  var previousPoint = null;
  var mask = null;
  var letterPixels = 0;
  var audioContext = null;
  var paintColour = [240, 240, 240];
  var completionThreshold = 0.98;

  // Only completed attempts are persisted; unfinished drawings start fresh.
  var completedLetters = new Set();
  var bestScores = new Map();
  var storageKey = "zatam:026-sp:personal-bests:v1";
  var attemptStartedAt = null;
  var timerInterval = null;
  var attemptScoringReady = false;
  var completedAttempt = null;
  var submittingScore = false;
  var leaderboardStatus = document.getElementById("leaderboard-status");
  var retryScoreButton = document.getElementById("retry-score");
  var vowelOptions = document.getElementById("vowel-options");
  var vowelButtons = [];

  function loadProgress() {
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (!saved || ![1, 2, 3].includes(saved.version) || !Array.isArray(saved.bests)) return;
      saved.bests.forEach(function (best) {
        if (!best || !chars.includes(best.letter) || !Number.isInteger(best.score) ||
            best.score < 0 || best.score > 100 || !Number.isFinite(best.seconds) ||
            best.seconds < 0 || !Number.isFinite(best.coverage) ||
            best.coverage < 60 || best.coverage > 100) return;
        var expected = saved.version === 1
          ? Math.round(best.coverage * 0.8 + 20 * Math.max(0, 1 - best.seconds / 120))
          : saved.version === 2
            ? Math.round(best.coverage * 0.4 + 60 * Math.max(0, 1 - best.seconds / 120))
            : calculateScore(best.coverage, best.seconds);
        if (best.score !== expected) return;
        bestScores.set(best.letter, { letter: best.letter, score: calculateScore(best.coverage, best.seconds), seconds: best.seconds, coverage: best.coverage });
        completedLetters.add(best.letter);
      });
      if (saved.version !== 3) saveProgress();
    } catch (error) {
      document.getElementById("save-status").textContent = "Saved progress could not be read. New completions will try to save again.";
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 3, bests: Array.from(bestScores.values()) }));
      document.getElementById("save-status").textContent = "";
    } catch (error) {
      document.getElementById("save-status").textContent = "Browser storage is unavailable. This attempt is shown, but may not survive reload.";
    }
  }

  function updatePersonalBest() {
    var total = 0;
    bestScores.forEach(function (best) { total += best.score; });
    document.getElementById("personal-score").textContent = bestScores.size ? Math.round(total / bestScores.size) + " / 100" : "— / 100";
    document.getElementById("letters-completed").textContent = bestScores.size + " / " + chars.length + " letters completed";
    var best = bestScores.get(letter);
    document.getElementById("best-letter").textContent = letter || "—";
    document.getElementById("best-score").textContent = best ? best.score + " / 100" : "—";
    document.getElementById("best-time").textContent = best ? formatTime(best.seconds) : "—";
    document.getElementById("best-coverage").textContent = best ? best.coverage.toFixed(1) + "%" : "—";
    document.getElementById("best-status").textContent = best ? "" : "Complete this vowel to save a personal best.";
  }

  function formatTime(seconds) {
    var total = Math.floor(seconds);
    return String(Math.floor(total / 60)).padStart(2, "0") + ":" + String(total % 60).padStart(2, "0");
  }

  function elapsedSeconds() {
    return attemptStartedAt === null ? 0 : Math.max(0, (performance.now() - attemptStartedAt) / 1000);
  }

  function stopTimer() {
    if (timerInterval !== null) clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetAttempt() {
    stopTimer();
    attemptStartedAt = null;
    attemptScoringReady = false;
    completedAttempt = null;
    leaderboardStatus.textContent = "";
    retryScoreButton.hidden = true;
    document.getElementById("paint-time").textContent = "00:00";
    document.getElementById("paint-coverage").textContent = "0%";
  }

  function startTimer() {
    if (attemptStartedAt !== null) return;
    attemptStartedAt = performance.now();
    if (scoreApi) {
      try {
        scoreApi.initGameScore({
          gameId: "026-sp",
          gameName: "स्वराः Paint",
          levelId: config.levelIds[letter],
          levelName: "Vowel " + letter
        });
        attemptScoringReady = true;
      } catch (scoreError) {
        console.warn("[Vowel Paint] Could not initialize shared scoring.", scoreError);
        scoreApiError = "We couldn’t prepare leaderboard saving. Your result is still available here.";
      }
    }
    timerInterval = setInterval(function () {
      document.getElementById("paint-time").textContent = formatTime(elapsedSeconds());
    }, 250);
  }

  function calculateScore(coveragePercent, seconds) {
    return Math.max(0, Math.min(100, Math.round(100 * (1 - Math.max(0, seconds) / 120))));
  }

  function recordCompletion(coveragePercent) {
    var seconds = elapsedSeconds();
    var score = calculateScore(coveragePercent, seconds);
    stopTimer();
    document.getElementById("paint-time").textContent = formatTime(seconds);
    document.getElementById("result-time").textContent = formatTime(seconds);
    document.getElementById("result-coverage").textContent = coveragePercent.toFixed(1) + "%";
    document.getElementById("result-score").textContent = score + " / 100";
    var previous = bestScores.get(letter);
    if (!previous || score > previous.score ||
        (score === previous.score && (seconds < previous.seconds ||
          (seconds === previous.seconds && coveragePercent > previous.coverage)))) {
      bestScores.set(letter, { letter: letter, score: score, seconds: seconds, coverage: coveragePercent });
    }
    saveProgress();
    updatePersonalBest();
    completedAttempt = {
      vowel: letter,
      levelId: config.levelIds[letter],
      levelName: "Vowel " + letter,
      score: score,
      seconds: seconds,
      coverage: coveragePercent,
      saved: false
    };
  }

  function setSubmissionBusy(busy) {
    submittingScore = busy;
    reloadButton.disabled = busy;
    win.querySelector("button").disabled = busy;
    retryScoreButton.disabled = busy;
    vowelButtons.forEach(function (button) { button.disabled = busy; });
  }

  async function submitCompletedScore() {
    var attempt = completedAttempt;
    if (!attempt || attempt.saved || submittingScore) return;
    if (!scoreApi || !attemptScoringReady) {
      leaderboardStatus.textContent = scoreApiError || "We couldn’t connect to the leaderboard. Please try again later.";
      retryScoreButton.hidden = true;
      return;
    }
    setSubmissionBusy(true);
    retryScoreButton.hidden = true;
    leaderboardStatus.textContent = "Saving score to leaderboard…";
    try {
      var result = await scoreApi.submitGameScore(attempt.score, {
        result: "completed",
        levelId: attempt.levelId,
        levelName: attempt.levelName,
        metrics: {
          // Older shared scorers store these fields from metrics; the current
          // scorer also accepts the explicit levelId/levelName options above.
          levelId: attempt.levelId,
          levelName: attempt.levelName,
          vowel: attempt.vowel,
          paintedPercentage: attempt.coverage,
          tracingSeconds: attempt.seconds,
          scoringMethod: "time-only-v1"
        }
      });
      if (result && (result.ok || result.reason === "already-submitted")) {
        attempt.saved = true;
        leaderboardStatus.textContent = "Score saved to leaderboard.";
      } else {
        leaderboardStatus.textContent = result && result.reason === "not-signed-in"
          ? "Sign in to Zat.am, then retry to save this score."
          : "Score was not saved. Please retry.";
        retryScoreButton.hidden = false;
      }
    } catch (scoreError) {
      leaderboardStatus.textContent = "Could not save to leaderboard. Your result is still shown; please retry.";
      retryScoreButton.hidden = false;
    } finally {
      setSubmissionBusy(false);
    }
  }

  function updateVowels() {
    vowelButtons.forEach(function (button, index) {
      var vowel = chars[index];
      var complete = completedLetters.has(vowel);
      button.textContent = vowel + (complete ? " ✓" : "");
      button.className = complete ? "is-complete" : "";
      button.setAttribute("aria-pressed", String(vowel === letter));
      button.setAttribute("aria-label", vowel + (complete ? ": completed, play again" : ": practise"));
    });
    updatePersonalBest();
  }

  chars.forEach(function (vowel) {
    var button = document.createElement("button");
    button.type = "button";
    button.lang = "sa";
    button.addEventListener("click", function () {
      prepareAudio();
      paintLetter(vowel);
    });
    vowelOptions.appendChild(button);
    vowelButtons.push(button);
  });

  // A stable bitmap lets CSS resize the board without clearing a trace.
  canvas.width = 800;
  canvas.height = 800;

  function stopStroke() {
    var pointer = activePointer;
    activePointer = null;
    previousPoint = null;
    if (pointer !== null && canvas.hasPointerCapture(pointer)) {
      canvas.releasePointerCapture(pointer);
    }
  }

  function setState(next) {
    stopStroke();
    state = next;
    container.dataset.state = next;
    intro.hidden = next !== "intro";
    win.hidden = next !== "win";
    error.hidden = next !== "error";
    reloadButton.disabled = next === "intro";
    if (next === "win") completedLetters.add(letter);
    updateVowels();
  }

  function prepareAudio() {
    if (!sound) return;
    var Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    try {
      if (!audioContext) audioContext = new Audio();
      if (audioContext.state === "suspended") audioContext.resume().catch(function () {});
    } catch (audioError) {
      // Audio availability never affects tracing.
    }
  }

  function tone(frequency) {
    if (!sound || !audioContext || audioContext.state !== "running") return;
    var oscillator = audioContext.createOscillator();
    var gain = audioContext.createGain();
    var now = audioContext.currentTime;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.onended = function () { oscillator.disconnect(); gain.disconnect(); };
    oscillator.start(now);
    oscillator.stop(now + 0.18);
  }

  function playFeedback(success) {
    if (!sound) return;
    if (success) {
      winSound.currentTime = 0;
      var playback = winSound.play();
      if (playback && playback.catch) playback.catch(function () { tone(660); });
    } else {
      // The original error.ogg asset is missing from the repository.
      tone(180);
    }
  }

  function paintLetter(sameLetter, isRetry) {
    if (submittingScore) return;
    stopStroke();
    if (!isRetry) resetAttempt();
    else document.getElementById("paint-coverage").textContent = "0%";
    letter = sameLetter || chars[Math.floor(Math.random() * chars.length)];
    context.clearRect(0, 0, canvas.width, canvas.height);

    var fontSize = canvas.height / 1.5;
    var fontFamily = '"Nirmala UI", "Noto Sans Devanagari", Mangal, sans-serif';
    var metrics;
    do {
      context.font = "bold " + fontSize + "px " + fontFamily;
      metrics = context.measureText(letter);
      if (metrics.width <= canvas.width * 0.8 &&
          metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent <= canvas.height * 0.8) break;
      fontSize *= 0.9;
    } while (fontSize > 40);

    var left = metrics.actualBoundingBoxLeft || 0;
    var right = metrics.actualBoundingBoxRight || metrics.width;
    var ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8;
    var descent = metrics.actualBoundingBoxDescent || 0;
    context.textBaseline = "alphabetic";
    context.fillStyle = "rgb(255,30,20)";
    context.fillText(letter,
      (canvas.width - (right - left)) / 2,
      (canvas.height + ascent - descent) / 2);

    var original = context.getImageData(0, 0, canvas.width, canvas.height).data;
    mask = new Uint8Array(canvas.width * canvas.height);
    letterPixels = 0;
    for (var i = 0; i < mask.length; i++) {
      if (original[i * 4 + 3] > 32) {
        mask[i] = 1;
        letterPixels++;
      }
    }

    context.strokeStyle = "rgb(" + paintColour.join(",") + ")";
    context.fillStyle = context.strokeStyle;
    context.lineWidth = canvas.height / 19;
    context.lineCap = "round";
    context.lineJoin = "round";
    canvas.setAttribute("aria-label", "Trace the Sanskrit vowel " + letter);
    setState("play");
  }

  function pointFromEvent(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width / rect.width,
      y: (event.clientY - rect.top) * canvas.height / rect.height
    };
  }

  function insideLetter(point) {
    var x = Math.floor(point.x);
    var y = Math.floor(point.y);
    return x >= 0 && y >= 0 && x < canvas.width && y < canvas.height &&
      mask[y * canvas.width + x] === 1;
  }

  function showError() {
    setState("error");
    playFeedback(false);
    try { if (navigator.vibrate) navigator.vibrate(100); } catch (ignored) {}
  }

  function paint(point) {
    if (state !== "play") return;
    var from = previousPoint || point;
    var distance = Math.hypot(point.x - from.x, point.y - from.y);
    var steps = Math.max(1, Math.ceil(distance));

    // Check the complete line, including gaps between fast pointer events.
    for (var step = 0; step <= steps; step++) {
      if (!insideLetter({
        x: from.x + (point.x - from.x) * step / steps,
        y: from.y + (point.y - from.y) * step / steps
      })) {
        showError();
        return;
      }
    }

    context.beginPath();
    if (previousPoint) {
      context.moveTo(from.x, from.y);
      context.lineTo(point.x, point.y);
      context.stroke();
    } else {
      context.arc(point.x, point.y, context.lineWidth / 2, 0, Math.PI * 2);
      context.fill();
    }
    previousPoint = point;
  }

  function checkCompletion() {
    if (state !== "play" || !letterPixels) return;
    var painted = context.getImageData(0, 0, canvas.width, canvas.height).data;
    var width = canvas.width;
    var height = canvas.height;
    var distance = new Float32Array(mask.length);
    var diagonal = Math.SQRT2;
    var tolerance = context.lineWidth;
    var actuallyPainted = 0;

    // A completed trace may leave thin red edges beside the brush.
    // Measure the distance from each letter pixel to an actual painted
    // letter pixel, rather than requiring every edge pixel to be grey.
    distance.fill(width + height);
    for (var i = 0; i < mask.length; i++) {
      if (mask[i] && painted[i * 4] === paintColour[0] &&
          painted[i * 4 + 1] === paintColour[1] &&
          painted[i * 4 + 2] === paintColour[2]) {
        distance[i] = 0;
        actuallyPainted++;
      }
    }

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var index = y * width + x;
        if (x > 0) distance[index] = Math.min(distance[index], distance[index - 1] + 1);
        if (y > 0) {
          distance[index] = Math.min(distance[index], distance[index - width] + 1);
          if (x > 0) distance[index] = Math.min(distance[index], distance[index - width - 1] + diagonal);
          if (x < width - 1) distance[index] = Math.min(distance[index], distance[index - width + 1] + diagonal);
        }
      }
    }

    for (var y = height - 1; y >= 0; y--) {
      for (var x = width - 1; x >= 0; x--) {
        var index = y * width + x;
        if (x < width - 1) distance[index] = Math.min(distance[index], distance[index + 1] + 1);
        if (y < height - 1) {
          distance[index] = Math.min(distance[index], distance[index + width] + 1);
          if (x > 0) distance[index] = Math.min(distance[index], distance[index + width - 1] + diagonal);
          if (x < width - 1) distance[index] = Math.min(distance[index], distance[index + width + 1] + diagonal);
        }
      }
    }

    var covered = 0;
    for (var i = 0; i < mask.length; i++) {
      if (mask[i] && distance[i] <= tolerance) covered++;
    }
    var coveragePercent = actuallyPainted / letterPixels * 100;
    document.getElementById("paint-coverage").textContent = coveragePercent.toFixed(1) + "%";
    if (actuallyPainted / letterPixels >= 0.6 &&
        covered / letterPixels >= completionThreshold) {
      recordCompletion(coveragePercent);
      setState("win");
      playFeedback(true);
      submitCompletedScore();
    }
  }

  canvas.addEventListener("pointerdown", function (event) {
    if (state !== "play" || activePointer !== null || !event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    prepareAudio();
    startTimer();
    activePointer = event.pointerId;
    canvas.setPointerCapture(activePointer);
    paint(pointFromEvent(event));
  });

  canvas.addEventListener("pointermove", function (event) {
    if (event.pointerId !== activePointer || state !== "play") return;
    event.preventDefault();
    paint(pointFromEvent(event));
  });

  canvas.addEventListener("pointerup", function (event) {
    if (event.pointerId !== activePointer) return;
    event.preventDefault();
    paint(pointFromEvent(event));
    stopStroke();
    checkCompletion();
  });

  canvas.addEventListener("pointercancel", stopStroke);
  canvas.addEventListener("lostpointercapture", function (event) {
    if (event.pointerId === activePointer) stopStroke();
  });
  window.addEventListener("blur", stopStroke);

  intro.querySelector("button").addEventListener("click", function () {
    prepareAudio();
    paintLetter(letter);
  });
  error.querySelector("button").addEventListener("click", function () {
    prepareAudio();
    paintLetter(letter, true);
  });
  win.querySelector("button").addEventListener("click", function () {
    prepareAudio();
    paintLetter();
  });
  reloadButton.addEventListener("click", function () { paintLetter(); });
  soundButton.addEventListener("click", function () {
    sound = !sound;
    soundButton.textContent = sound ? "Sound on" : "Sound off";
    soundButton.setAttribute("aria-pressed", String(sound));
    if (sound) prepareAudio();
    else { winSound.pause(); winSound.currentTime = 0; }
  });
  retryScoreButton.addEventListener("click", submitCompletedScore);

  loadProgress();
  paintLetter();
  setState("intro");
  intro.querySelector("button").disabled = false;
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (state === "intro") { paintLetter(letter); setState("intro"); }
    });
  }
}()).catch(function (loadError) {
  console.warn("[Vowel Paint] Could not initialize the game.", loadError);
  document.getElementById("game-load-status").textContent = "We couldn’t load the vowels. Please try again.";
  var retry = document.getElementById("retry-load");
  retry.hidden = false;
  retry.addEventListener("click", function () { window.location.reload(); });
});
