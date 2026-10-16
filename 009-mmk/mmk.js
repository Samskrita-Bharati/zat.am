/* =========================================================
   009-MMK — MEMORY क्रीडा
   =========================================================

   Existing Memory game logic updated for:

   - Zat.am shared game layout
   - Live 0–100 scoring
   - Wrong moves
   - Match progress
   - Timer
   - Completion result panel
   - Shared Zat.am leaderboard submission

   Scoring:
   - Starts at 100
   - Each wrong move = -5 points
   - Minimum score = 0
   - Time is recorded, but does not reduce the score
   ========================================================= */

/* =========================================================
   GAME STATE
   ========================================================= */

var secs = 0;

var numberOfWrongTries = 0;

var matchesdone = 0;

var timer = null;

var gameFinished = false;

/* =========================================================
   ELEMENTS
   ========================================================= */

var triesElement = document.getElementById("nowt");

var scoreElement = document.getElementById("scoreValue");

var matchesElement = document.getElementById("matchesValue");

var timerElement = document.getElementById("timer");

var progressElement = document.getElementById("pr");

var resultPanel = document.getElementById("resultPanel");

var resultScore = document.getElementById("resultScore");

var resultDetails = document.getElementById("resultDetails");

var scoreSaveStatus = document.getElementById("scoreSaveStatus");

/* =========================================================
   URL OPTIONS
   ========================================================= */

const urlParams = new URLSearchParams(window.location.search);

/*
  Open mode

  ?o=1

  Cards start open.
*/

var o = urlParams.get("o");

if (!o) {
  o = 0;
}

/*
  Data set
*/

var set = urlParams.get("s");

if (!set || isNaN(set) || set >= wlist.length) {
  set = 0;
}

/*
  Learn mode

  ?l=1
*/

var l = urlParams.get("l");

if (!l) {
  l = 0;
}

/*
  Transliteration mode

  ?t=1
*/

var t = urlParams.get("t");

if (!t) {
  t = 0;
}

/* =========================================================
   SCORE
   ========================================================= */

function calculateScore(elapsedSeconds = secs) {
  /*
    MEMORY GAME SCORING

    Base score:
    100

    Accuracy:
    -5 points per wrong move

    Speed:
    First 2 minutes are free.

    After 2 minutes:
    -1 point for every full additional minute.

    Maximum time penalty:
    20 points.

    Minimum final score:
    0.
  */

  const mistakePenalty = numberOfWrongTries * 5;

  const gracePeriodSeconds = 2 * 60;

  const extraSeconds = Math.max(0, elapsedSeconds - gracePeriodSeconds);

  const timePenalty = Math.min(20, Math.floor(extraSeconds / 60));

  return Math.max(0, 100 - mistakePenalty - timePenalty);
}

function updateScoreUI() {
  if (!scoreElement) {
    return;
  }

  scoreElement.textContent = String(calculateScore());
}

/* =========================================================
   MATCHES
   ========================================================= */

function updateMatchesUI() {
  if (!matchesElement) {
    return;
  }

  matchesElement.textContent = `${matchesdone} / 12`;

  if (progressElement) {
    progressElement.value = matchesdone;
  }
}

/* =========================================================
   WRONG MOVES
   ========================================================= */

function updateWrongMovesUI() {
  if (!triesElement) {
    return;
  }

  triesElement.textContent = Sanscript.t(
    String(numberOfWrongTries),
    "iast",
    "devanagari",
  );
}

/* =========================================================
   TIMER
   ========================================================= */

function updateTimerUI() {
  if (!timerElement) {
    return;
  }

  /*
    The card itself is already labelled "Time",
    so only show the value here.
  */

  timerElement.textContent =
    Sanscript.t(String(secs), "iast", "devanagari") + " seconds";
}

function countSecs() {
  if (gameFinished) {
    return;
  }

  updateTimerUI();
  updateScoreUI();

  secs++;
}

/* =========================================================
   RESTART
   ========================================================= */

function restart() {
  /*
    Page reload creates a completely fresh game run.

    reset() is called as a safety measure for the
    shared scoring state before reload.
  */

  if (window.zatamScore && typeof window.zatamScore.reset === "function") {
    window.zatamScore.reset();
  }

  window.location.reload();
}

/* =========================================================
   LEARN MODE
   ========================================================= */

if (l == 1) {
  var slideshowButton = document.getElementById("ss");

  var gameStats = document.getElementById("gameStats");

  var progressWrapper = document.querySelector(".memory-progress-wrapper");

  if (slideshowButton) {
    slideshowButton.style.display = "inline-flex";
  }

  if (gameStats) {
    gameStats.style.display = "none";
  }

  if (progressWrapper) {
    progressWrapper.style.display = "none";
  }
}

/* =========================================================
   GAME DIMENSIONS
   ========================================================= */

var rowLength = 4;

var colLength = 6;

var gamesize = rowLength * colLength;

/*
  CSS now controls the responsive card size.

  We no longer need the old hard-coded:

  width = 150
  height = 120
*/

/* =========================================================
   START TIMER
   ========================================================= */

if (l != 1) {
  updateTimerUI();

  timer = setInterval(countSecs, 1000);
}

/* =========================================================
   INITIAL UI
   ========================================================= */

updateScoreUI();

updateWrongMovesUI();

updateMatchesUI();

/* =========================================================
   GAME SETUP
   ========================================================= */

function code() {
  var waiting = {
    value: false,
  };

  var image = ilist[parseInt(set)];

  var words = wlist[parseInt(set)];

  var D1Data = [];

  var D2Data = [];

  var count = 0;

  /*
    Build matching image + word pairs.
  */

  for (var x = 0; x < gamesize / 2; x++) {
    D1Data.push({
      src: image[x],
      clicked: false,
    });

    D1Data.push({
      src: image[x],
      clicked: false,
      wrd: words[x],
    });
  }

  /*
    Shuffle into a 4 × 6 grid.
  */

  var rand = 0;

  for (var y = 0; y < rowLength; y++) {
    var temp = [];

    var x = 0;

    while (x < colLength) {
      if (l != 1) {
        rand = Math.floor(Math.random() * D1Data.length);

        temp.push(D1Data[rand]);

        temp[x].y = x;

        temp[x].x = y;

        D1Data.splice(rand, 1);
      } else {
        temp.push(D1Data[rand]);

        rand += 1;
      }

      x++;
    }

    D2Data.push(temp);
  }

  var clickedCards = [];

  var bg = "../शत.म्.png";

  /* =======================================================
     CREATE TABLE
     ======================================================= */

  function genTable(rows, columns, imageData2D) {
    var table = document.createElement("table");

    table.id = "tbl";

    var myTableDiv = document.getElementById("mytable");

    for (var i = 0; i < rows; i++) {
      var tr = document.createElement("tr");

      table.appendChild(tr);

      for (var j = 0; j < columns; j++) {
        var td = document.createElement("td");

        tr.appendChild(td);

        /*
          Picture card
        */

        if (!imageData2D[i][j].wrd) {
          var img = document.createElement("img");

          img.alt = "Memory card";

          if (o != 1) {
            img.src = bg;
          } else {
            img.src = imageData2D[i][j].src;
          }

          td.appendChild(img);
        } else {
          /*
          Sanskrit word card
        */
          var p = document.createElement("p");

          p.className = "myp";

          p.innerHTML = imageData2D[i][j].wrd;

          if (t == 1) {
            p.innerHTML +=
              " - " +
              Sanscript.t(imageData2D[i][j].wrd, "devanagari", "itrans");
          }

          td.appendChild(p);
        }
      }
    }

    myTableDiv.appendChild(table);
  }

  genTable(rowLength, colLength, D2Data);

  /* =======================================================
     CARD CLICK
     ======================================================= */

  var clkfn = function () {
    if (gameFinished) {
      return;
    }

    var row = this.parentElement.parentElement.rowIndex;

    var column = this.parentElement.cellIndex;

    if (!D2Data[row][column].clicked && !waiting.value) {
      /*
        First card
      */

      if (clickedCards.length === 0) {
        if (this.tagName === "IMG") {
          this.src = D2Data[row][column].src;
        }

        D2Data[row][column].clicked = true;

        clickedCards.push(D2Data[row][column]);

        var firstRow = document.getElementsByTagName("tr")[clickedCards[0].x];

        var firstCell = firstRow.getElementsByTagName("td")[clickedCards[0].y];

        firstCell.style.border = "2px dashed #f16945";
      } else {
        /*
        Second card
      */
        var firstCard = clickedCards[0];

        var currentCard = D2Data[row][column];

        /*
          MATCH
        */

        if (currentCard.src === firstCard.src) {
          var firstRow = document.getElementsByTagName("tr")[firstCard.x];

          var firstCell = firstRow.getElementsByTagName("td")[firstCard.y];

          /*
            Mark first card as matched.
          */

          firstCell.style.border = "3px solid #2f6dff";

          firstCell.style.cursor = "default";

          firstCell.style.color = "#2f6dff";

          firstCell.innerHTML += "✔️";

          /*
            Mark second card as matched.
          */

          this.parentElement.style.border = "3px solid #2f6dff";

          this.parentElement.style.cursor = "default";

          this.style.color = "#2f6dff";

          if (this.tagName === "IMG") {
            this.src = currentCard.src;
          }

          this.innerHTML += "✔️";

          currentCard.clicked = true;

          clickedCards = [];

          matchesdone++;

          count += 2;

          updateMatchesUI();

          /*
            Game complete
          */

          if (count === gamesize) {
            finishGame();

            return;
          }
        } else {
          /*
          WRONG MATCH
        */
          numberOfWrongTries++;

          updateWrongMovesUI();

          updateScoreUI();

          /*
            Reveal second image if it
            is an image card.
          */

          if (this.tagName === "IMG") {
            this.src = currentCard.src;
          }

          currentCard.clicked = true;

          waiting.value = true;

          var firstRow = document.getElementsByTagName("tr")[firstCard.x];

          var firstCell = firstRow.getElementsByTagName("td")[firstCard.y];

          firstCell.style.border = "1px solid #eadfce";

          setTimeout(
            flipback,
            700,
            row,
            column,
            this,
            clickedCards,
            waiting,
            D2Data,
          );
        }
      }
    }
  };

  /* =======================================================
     ENABLE CARD CLICKS
     ======================================================= */

  if (l != 1) {
    var imageList = document.getElementById("tbl").getElementsByTagName("img");

    for (var i = 0; i < imageList.length; i++) {
      imageList[i].onclick = clkfn;
    }

    var wordList = document.getElementById("tbl").getElementsByClassName("myp");

    for (var i = 0; i < wordList.length; i++) {
      wordList[i].onclick = clkfn;
    }
  }

  /* =======================================================
     FLIP WRONG PAIR BACK
     ======================================================= */

  function flipback(
    row,
    column,
    currentElement,
    clickedCards,
    waiting,
    D2Data,
  ) {
    if (!clickedCards.length) {
      waiting.value = false;

      return;
    }

    var firstCard = clickedCards[0];

    var firstCell =
      document.getElementById("tbl").rows[firstCard.x].cells[firstCard.y];

    /*
      Hide first image again.

      Word cards remain visible because the
      game pairs words with pictures.
    */

    var firstImage = firstCell.querySelector("img");

    if (firstImage) {
      firstImage.src = bg;
    }

    /*
      Hide second image again if needed.
    */

    if (currentElement.tagName === "IMG") {
      currentElement.src = bg;
    }

    firstCell.style.border = "";

    firstCard.clicked = false;

    D2Data[row][column].clicked = false;

    waiting.value = false;

    clickedCards.splice(0, 1);
  }
}

/* =========================================================
   GAME COMPLETION
   ========================================================= */

async function finishGame() {
  if (gameFinished) {
    return;
  }

  gameFinished = true;

  if (timer) {
    clearInterval(timer);

    timer = null;
  }

  /*
    secs increments after each displayed second.

    Use the current displayed game time.
  */

  var finalTime = Math.max(0, secs - 1);

  var finalScore = calculateScore(finalTime);

  /*
    Update the final live values.
  */

  if (scoreElement) {
    scoreElement.textContent = String(finalScore);
  }

  if (timerElement) {
    timerElement.textContent =
      Sanscript.t(String(finalTime), "iast", "devanagari") + " seconds";
  }

  /*
    Result panel
  */

  if (resultScore) {
    resultScore.textContent = String(finalScore);
  }

  if (resultDetails) {
    var devanagariTime = Sanscript.t(String(finalTime), "iast", "devanagari");

    var devanagariMistakes = Sanscript.t(
      String(numberOfWrongTries),
      "iast",
      "devanagari",
    );

    resultDetails.innerHTML =
      "You found all 12 pairs in " +
      "<strong>" +
      devanagariTime +
      " seconds</strong>" +
      " with " +
      "<strong>" +
      devanagariMistakes +
      " wrong moves</strong>.";
  }

  if (resultPanel) {
    resultPanel.classList.remove("zatam-hidden");

    resultPanel.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  /*
    Submit leaderboard score.
  */

  await saveScore(finalScore, finalTime);
}

/* =========================================================
   LEADERBOARD SUBMISSION
   ========================================================= */

async function saveScore(finalScore, finalTime) {
  if (!scoreSaveStatus) {
    return;
  }

  scoreSaveStatus.className = "zatam-game-status zatam-game-status-info";

  scoreSaveStatus.textContent = "Saving your score...";

  /*
    Shared scorer should have been loaded
    by index.html.
  */

  if (!window.zatamScore || typeof window.zatamScore.submit !== "function") {
    scoreSaveStatus.className = "zatam-game-status zatam-game-status-error";

    scoreSaveStatus.textContent =
      "Your game is complete, but the leaderboard is not available right now.";

    return;
  }

  try {
    var result = await window.zatamScore.submit(finalScore, {
      metrics: {
        mistakes: numberOfWrongTries,

        matches: matchesdone,

        gameTimerSeconds: finalTime,
      },
    });

    /*
      Saved successfully
    */

    if (result && result.ok) {
      scoreSaveStatus.className = "zatam-game-status zatam-game-status-success";

      scoreSaveStatus.textContent = "Score saved to the leaderboard ✓";

      return;
    }

    /*
      User is not signed in
    */

    if (result && result.reason === "not-signed-in") {
      scoreSaveStatus.className = "zatam-game-status zatam-game-status-info";

      scoreSaveStatus.textContent =
        "Game complete! Sign in to save future scores to the leaderboard.";

      return;
    }

    /*
      Duplicate submission
    */

    if (result && result.reason === "already-submitted") {
      scoreSaveStatus.className = "zatam-game-status zatam-game-status-success";

      scoreSaveStatus.textContent = "Score already saved ✓";

      return;
    }

    scoreSaveStatus.className = "zatam-game-status zatam-game-status-error";

    scoreSaveStatus.textContent =
      "Game complete, but the score could not be saved.";
  } catch (error) {
    console.error("[009-mmk] Score submission failed:", error);

    scoreSaveStatus.className = "zatam-game-status zatam-game-status-error";

    scoreSaveStatus.textContent =
      "Game complete, but the leaderboard score could not be saved.";
  }
}

/* =========================================================
   START GAME
   ========================================================= */

code();
