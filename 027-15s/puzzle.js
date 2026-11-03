/**
 * Based on the sliding puzzle by Arnis Ritins.
 * Copyright (c) 2015 Arnis Ritins
 * Released under the MIT license.
 */
(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var size = params.get("size") === "3" ? 3 : 4;
  var levelId = size === 3 ? "1" : "2";
  var levelName = size === 3 ? "8 Puzzle" : "15 Puzzle";
  var total = size * size;
  var startingScore = size === 3 ? 1000 : 2000;

  var game = document.querySelector(".sliding-game");
  var puzzle = document.getElementById("puzzle");
  var movesElement = document.getElementById("moves");
  var timeElement = document.getElementById("puzzle-time");
  var solveButton = document.getElementById("solve");
  var scrambleButton = document.getElementById("scramble");

  var dialog = document.querySelector(".puzzle-result");
  var replayButton = document.getElementById("result-replay");
  var closeButton = document.getElementById("result-close");
  var scoreStatus = document.getElementById("score-status");
  var retryScoreButton = document.getElementById("retry-score");

  var moves = 0;
  var scrambling = false;
  var playing = false;
  var startedAt = 0;
  var timerId = null;

  var scoringModule = null;
  var scoringLoading = null;
  var completedAttempt = null;
  var savingScore = false;
  var sharedRunInitialized = false;

  var bestFirebase = null;
  var bestFirestore = null;
  var bestRequestId = 0;

  game.style.setProperty("--puzzle-size", String(size));

  document.title =
    size === 3 ? "८ समस्या - 8 Puzzle" : "१५ समस्या - 15 Puzzle";

  document.getElementById("puzzle-title").textContent =
    size === 3 ? "८ समस्या" : "१५ समस्या";

  document.getElementById("option-" + size).setAttribute(
    "aria-current",
    "page"
  );

  function devanagari(value) {
    return Sanscript.t(String(value), "iast", "devanagari");
  }

  function formatTime(seconds) {
    return (
      String(Math.floor(seconds / 60)).padStart(2, "0") +
      ":" +
      String(seconds % 60).padStart(2, "0")
    );
  }

  /*
   * Personal best is read from the signed-in user's existing
   * leaderboard history. No additional database writes are used.
   */
  function showPersonalBest(best, message) {
    document.getElementById("best-score").textContent =
      best ? best.score + " / 100" : "— / 100";

    document.getElementById("best-moves").textContent =
      best ? String(best.moves) : "—";

    document.getElementById("best-time").textContent =
      best ? formatTime(best.seconds) : "—";

    document.getElementById("best-status").textContent =
      message || "";
  }

  function isBetterBest(candidate, current) {
    return (
      !current ||
      candidate.score > current.score ||
      (
        candidate.score === current.score &&
        (
          candidate.seconds < current.seconds ||
          (
            candidate.seconds === current.seconds &&
            candidate.moves < current.moves
          )
        )
      )
    );
  }

  function bestFromHistory(history, uid) {
    var best = null;

    history.forEach(function (monthDocument) {
      var data = monthDocument.data();
      var entries = data.entries || {};
      var metadata = data.attemptMeta || {};

      Object.keys(entries).forEach(function (key) {
        // Shared format: timestamp_UID_elapsedSeconds_gameId.
        var parts = key.split("_");

        if (
          parts.length < 4 ||
          parts[parts.length - 1] !== "027-15s"
        ) {
          return;
        }

        // Supports UIDs containing underscores.
        var entryUserId = parts.slice(1, -2).join("_");

        if (entryUserId !== uid) return;

        var attempt = metadata[key];

        if (!attempt || attempt.result !== "completed") return;
        // Prefer the shared level ID; retain older puzzle-size-only history.
        var savedLevelId = attempt.levelId ?? attempt.metrics?.levelId;
        if (savedLevelId !== undefined && savedLevelId !== null && savedLevelId !== "") {
          if (String(savedLevelId) !== levelId) return;
        } else if (Number(attempt.puzzleSize) !== size) return;

        // Read the exact 0–100 score stored by shared scoring.
        var candidate = {
          score: entries[key],
          moves: attempt.moves,
          seconds: attempt.puzzleSeconds ?? attempt.elapsedSeconds
        };

        if (
          !Number.isInteger(candidate.score) ||
          candidate.score < 0 ||
          candidate.score > 100 ||
          !Number.isInteger(candidate.moves) ||
          candidate.moves <= 0 ||
          !Number.isInteger(candidate.seconds) ||
          candidate.seconds < 0
        ) {
          return;
        }

        if (isBetterBest(candidate, best)) {
          best = candidate;
        }
      });
    });

    return best;
  }

  async function loadPersonalBest(clearPrevious) {
    if (!bestFirebase || !bestFirestore) return;

    var requestId = ++bestRequestId;
    var user = bestFirebase.auth.currentUser;

    if (clearPrevious || !user) {
      showPersonalBest(null, "");
    }

    if (!user) {
      showPersonalBest(
        null,
        "Sign in to see your personal best."
      );
      return;
    }

    try {
      var history = await bestFirestore.getDocs(
        bestFirestore.collection(
          bestFirebase.db,
          "leaderboards",
          "027-15s",
          "gameHistory"
        )
      );

      // Ignore requests belonging to a previous account.
      if (
        requestId !== bestRequestId ||
        bestFirebase.auth.currentUser?.uid !== user.uid
      ) {
        return;
      }

      var best = bestFromHistory(history, user.uid);

      showPersonalBest(
        best,
        best ? "" : "No saved results for this puzzle size yet."
      );
    } catch (error) {
      if (
        requestId !== bestRequestId ||
        bestFirebase.auth.currentUser?.uid !== user.uid
      ) {
        return;
      }

      console.warn(
        "Personal best history could not load.",
        error
      );

      document.getElementById("best-status").textContent =
        "Could not refresh personal best. Please try refreshing the page.";
    }
  }

  async function initializePersonalBest() {
    try {
      var modules = await Promise.all([
        import("../auth/api/firebase-config.js"),
        import(
          "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js"
        )
      ]);

      bestFirebase = modules[0];
      bestFirestore = modules[1];

      bestFirebase.onAuthStateChanged(
        bestFirebase.auth,
        function () {
          loadPersonalBest(true);
        },
        function (error) {
          bestRequestId++;

          console.warn(
            "Personal best authentication failed.",
            error
          );

          showPersonalBest(
            null,
            "Could not check your sign-in status."
          );
        }
      );
    } catch (error) {
      console.warn("Personal best is unavailable.", error);

      showPersonalBest(
        null,
        "Personal best is temporarily unavailable."
      );
    }
  }

  function loadScoring() {
    if (scoringModule) {
      return Promise.resolve(scoringModule);
    }

    if (!scoringLoading) {
      scoringLoading = import("../js/game-score.js")
        .then(function (module) {
          scoringModule = module;
          return module;
        })
        .catch(function (error) {
          scoringLoading = null;
          throw error;
        });
    }

    return scoringLoading;
  }

  function elapsedSeconds() {
    return Math.floor((performance.now() - startedAt) / 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  async function startTimer() {
    stopTimer();

    playing = false;
    scrambling = true;
    solveButton.disabled = true;
    scrambleButton.disabled = true;
    sharedRunInitialized = false;

    try {
      var shared = await loadScoring();

      shared.initGameScore({
        gameId: "027-15s",
        gameName: "Sliding Number Puzzle",
        levelId: levelId,
        levelName: levelName
      });

      sharedRunInitialized = true;
    } catch (error) {
      console.warn(
        "Leaderboard unavailable. Local play is still available.",
        error
      );
    }

    startedAt = performance.now();
    timeElement.textContent = "00:00";

    scrambling = false;
    playing = true;
    solveButton.disabled = false;
    scrambleButton.disabled = false;
    puzzle.removeAttribute("aria-busy");

    timerId = setInterval(function () {
      timeElement.textContent = formatTime(elapsedSeconds());
    }, 250);
  }

  function updateMoves() {
    movesElement.textContent = devanagari(moves);
  }

  function clearAttempt() {
    completedAttempt = null;
    sharedRunInitialized = false;
    scoreStatus.textContent = "";
    retryScoreButton.hidden = true;
  }

  function getCell(row, col) {
    return document.getElementById(
      "cell-" + row + "-" + col
    );
  }

  function getEmptyCell() {
    return puzzle.querySelector(".empty");
  }

  function getAdjacentCells(cell) {
    var parts = cell.id.split("-");
    var row = Number(parts[1]);
    var col = Number(parts[2]);
    var adjacent = [];

    if (row < size - 1) adjacent.push(getCell(row + 1, col));
    if (row > 0) adjacent.push(getCell(row - 1, col));
    if (col < size - 1) adjacent.push(getCell(row, col + 1));
    if (col > 0) adjacent.push(getCell(row, col - 1));

    return adjacent;
  }

  function getEmptyAdjacentCell(cell) {
    return getAdjacentCells(cell).find(function (adjacent) {
      return adjacent.classList.contains("empty");
    });
  }

  function createSolvedBoard() {
    puzzle.innerHTML = "";
    puzzle.classList.remove("animate");

    var number = 1;

    for (var row = 0; row < size; row++) {
      for (var col = 0; col < size; col++) {
        var cell = document.createElement("span");

        cell.id = "cell-" + row + "-" + col;
        cell.style.left =
          "calc(" + (col * 100 / size) + "% + 2px)";
        cell.style.top =
          "calc(" + (row * 100 / size) + "% + 2px)";

        if (number < total) {
          cell.classList.add(
            "number",
            (row + col) % 2 ? "dark" : "light"
          );

          cell.dataset.number = String(number);
          cell.title = String(number);
          cell.textContent = devanagari(number);
          number++;
        } else {
          cell.className = "empty";
        }

        puzzle.appendChild(cell);
      }
    }
  }

  function shiftCell(cell) {
    if (!cell || !cell.classList.contains("number")) {
      return false;
    }

    var emptyCell = getEmptyAdjacentCell(cell);

    if (!emptyCell) return false;

    var previousStyle = cell.style.cssText;
    var previousId = cell.id;

    cell.style.cssText = emptyCell.style.cssText;
    cell.id = emptyCell.id;

    emptyCell.style.cssText = previousStyle;
    emptyCell.id = previousId;

    return true;
  }

  function isSolved() {
    if (
      !getCell(size - 1, size - 1).classList.contains("empty")
    ) {
      return false;
    }

    var expected = 1;

    for (var row = 0; row < size; row++) {
      for (var col = 0; col < size; col++) {
        if (
          expected < total &&
          getCell(row, col).dataset.number !== String(expected)
        ) {
          return false;
        }

        expected++;
      }
    }

    return true;
  }

  async function submitCompletedScore() {
    var attempt = completedAttempt;

    if (!attempt || attempt.saved || savingScore) return;

    savingScore = true;
    retryScoreButton.hidden = true;
    scoreStatus.textContent = "Saving your leaderboard score…";

    solveButton.disabled = true;
    scrambleButton.disabled = true;
    replayButton.disabled = true;
    closeButton.disabled = true;

    try {
      var shared = await loadScoring();

      // Fallback if scoring was unavailable when play started.
      if (!attempt.initialized) {
        shared.initGameScore({
          gameId: "027-15s",
          gameName: "Sliding Number Puzzle",
          levelId: levelId,
          levelName: levelName
        });

        attempt.initialized = true;
      }

      var result = await shared.submitGameScore(
        attempt.leaderboardScore,
        {
          result: "completed",
          levelId: levelId,
          levelName: levelName,
          metrics: {
            levelId: levelId,
            levelName: levelName,
            puzzleSize: size,
            puzzleType: size === 3 ? "8-puzzle" : "15-puzzle",
            moves: attempt.moves,
            elapsedSeconds: attempt.seconds,
            puzzleSeconds: attempt.seconds,
            rawScore: attempt.rawScore,
            maximumScore: startingScore
          }
        }
      );

      if (result.ok || result.reason === "already-submitted") {
        attempt.saved = true;
        loadPersonalBest(false);

        scoreStatus.textContent =
          "Leaderboard score saved: " +
          attempt.leaderboardScore +
          "/100.";
      } else {
        scoreStatus.textContent =
          result.reason === "not-signed-in"
            ? "Sign in to Zat.am, then retry to save this score."
            : "Score was not saved. Please retry.";

        retryScoreButton.hidden = false;
      }
    } catch (error) {
      console.warn("Puzzle score submission failed.", error);

      scoreStatus.textContent =
        "Could not save your score. Check your connection and retry.";

      retryScoreButton.hidden = false;
    } finally {
      savingScore = false;
      solveButton.disabled = false;
      scrambleButton.disabled = false;
      replayButton.disabled = false;
      closeButton.disabled = false;
    }
  }

  function finishGame() {
    var seconds = elapsedSeconds();

    var rawScore = Math.max(
      100,
      startingScore - seconds * 2 - moves * 2
    );

    var leaderboardScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(rawScore / startingScore * 100)
      )
    );

    playing = false;
    stopTimer();

    timeElement.textContent = formatTime(seconds);

    document.getElementById("result-time").textContent =
      formatTime(seconds);

    document.getElementById("result-moves").textContent =
      devanagari(moves);

    document.getElementById("result-score").textContent =
      leaderboardScore + " / 100";

    completedAttempt = {
      seconds: seconds,
      moves: moves,
      rawScore: rawScore,
      leaderboardScore: leaderboardScore,
      initialized: sharedRunInitialized,
      saved: false
    };

    scoreStatus.textContent = "";
    retryScoreButton.hidden = true;

    dialog.showModal();
    submitCompletedScore();
  }

  function solve() {
    if (scrambling || savingScore) return;

    clearAttempt();
    playing = false;
    stopTimer();

    moves = 0;
    updateMoves();
    timeElement.textContent = "00:00";

    createSolvedBoard();
  }

  function scramble() {
    if (scrambling || savingScore) return;

    clearAttempt();
    playing = false;
    scrambling = true;
    stopTimer();

    moves = 0;
    updateMoves();
    timeElement.textContent = "00:00";

    solveButton.disabled = true;
    scrambleButton.disabled = true;
    puzzle.classList.remove("animate");
    puzzle.setAttribute("aria-busy", "true");

    var previousCell = null;
    var steps = 0;

    // Legal movements keep the shuffled puzzle solvable.
    var interval = setInterval(function () {
      var adjacent = getAdjacentCells(getEmptyCell());

      var choices = adjacent.filter(function (cell) {
        return cell !== previousCell;
      });

      if (!choices.length) choices = adjacent;

      var selected = choices[
        Math.floor(Math.random() * choices.length)
      ];

      shiftCell(selected);
      previousCell = selected;
      steps++;

      if (steps >= 100) {
        clearInterval(interval);

        if (isSolved()) {
          shiftCell(getAdjacentCells(getEmptyCell())[0]);
        }

        startTimer();
      }
    }, 5);
  }

  puzzle.addEventListener("click", function (event) {
    if (!playing || scrambling) return;

    var cell = event.target.closest("span.number");

    if (!cell || cell.parentElement !== puzzle) return;

    puzzle.classList.add("animate");

    if (shiftCell(cell)) {
      moves++;
      updateMoves();

      if (isSolved()) {
        finishGame();
      }
    }
  });

  solveButton.addEventListener("click", solve);
  scrambleButton.addEventListener("click", scramble);
  retryScoreButton.addEventListener(
    "click",
    submitCompletedScore
  );

  closeButton.addEventListener("click", function () {
    if (savingScore) return;
    dialog.close();
  });
  dialog.addEventListener("cancel", function (event) {
    if (savingScore) event.preventDefault();
  });

  replayButton.addEventListener("click", function () {
    if (savingScore) return;

    dialog.close();
    scramble();
  });

  initializePersonalBest();
  updateMoves();
  createSolvedBoard();
}());
