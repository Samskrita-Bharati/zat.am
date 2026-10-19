const urlParams = new URLSearchParams(window.location.search);

var set = Number(urlParams.get("s") || 0);
var t = urlParams.get("t") || "0";

var m = [
  [
    "ॐ मित्राय नमः",
    "ॐ रवये नमः",
    "ॐ सूर्याय नमः",
    "ॐ भानवे नमः",
    "ॐ खगाय नमः",
    "ॐ पूष्णे नमः",
    "ॐ हिरण्यगर्भाय नमः",
    "ॐ मरीचये नमः",
    "ॐ आदित्याय नमः",
    "ॐ सवित्रे नमः",
    "ॐ अर्काय नमः",
    "ॐ भास्कराय नमः",
  ],
  [
    "चैत्रः",
    "वैशाखः",
    "ज्येष्ठः",
    "आषाढः",
    "श्रावणः",
    "भाद्रपदः",
    "आश्विनः",
    "कार्तिकः",
    "मार्गशीर्षः",
    "पौषः",
    "माघः",
    "फाल्गुनः",
  ],
  ["१", "२", "३", "४", "५", "६", "७", "८", "९", "१०", "११", "१२"],
];

if (!Number.isInteger(set) || !m[set]) {
  set = 0;
}

var m1 = m[set];
var m2 = m1.slice();
var filled = [];
var wrongtries = 0;
var activePosition = null;

var suryaCompleted = false;
var suryaSaving = false;
var suryaSaved = false;
var suryaFinalScore = 0;
var suryaStartedAt = null;

var suryaScoreApi = null;
var suryaScoreLoading = null;

const circleArray = document.querySelectorAll(
  ".surya-game .circle"
);

function devanagari(value) {
  return String(value).replace(
    /\d/g,
    (digit) => "०१२३४५६७८९"[digit]
  );
}

function setSun(fileName) {
  document.getElementById("spin").style.setProperty(
    "--surya-sun",
    `url("${fileName}")`
  );
}

function loadSuryaScoring() {
  if (suryaScoreApi) {
    return Promise.resolve(suryaScoreApi);
  }

  if (!suryaScoreLoading) {
    suryaScoreLoading = import("../js/game-score.js")
    .then((api) => {
        api.initGameScore({
            gameId: "012-sn",
            gameName: "सूर्यनमस्कारः",
        });

        suryaScoreApi = api;
        return api;
    })
    .catch((error) => {
        suryaScoreLoading = null;
        throw error;
    });
  }

  return suryaScoreLoading;
}

function showInvocation() {
  if (suryaCompleted) return;

  if (suryaStartedAt === null) {
    suryaStartedAt = Date.now();

    loadSuryaScoring().catch((error) => {
        console.warn(
          "Shared scoring unavailable. Local play can continue.",
          error
        );
    });
  }

  activePosition = null;
  stop();
}

function stop() {
  if (
    suryaCompleted ||
    activePosition !== null ||
    m2.length === 0
  ) {
    return;
  }

  const position = Math.floor(Math.random() * m2.length);
  const text = m2[position];

  activePosition = m1.indexOf(text) + 1;

  const word = document.getElementById("new");
  word.textContent = text;
  word.hidden = false;
  word.draggable = true;
  word.setAttribute("pos", activePosition);

  const transliteration = document.getElementById("trans");
  transliteration.textContent = "";
  transliteration.hidden = true;

  if (t === "1" && window.Sanscript) {
    transliteration.textContent = Sanscript.t(
      text,
      "devanagari",
      "itrans"
    );

    transliteration.hidden = false;
  }

  const startButton = document.getElementById("start-button");
  startButton.textContent = "अग्रिमम्";
  startButton.hidden = false;

  document.getElementById("placement-feedback").textContent =
  "Drag or tap to place the invocation in its correct position.";

  setSun("sun.png");
}

function allowDrop(event) {
  if (suryaCompleted || activePosition === null) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function drag(event) {
  if (suryaCompleted || activePosition === null) {
    event.preventDefault();
    return;
  }

  event.dataTransfer.setData("text/plain", "new");
  event.dataTransfer.effectAllowed = "move";
}

function drop(event) {
  event.preventDefault();

  if (event.dataTransfer.getData("text/plain") !== "new") return;

  placeInvocation(event.currentTarget);
}

function placeInvocation(slot) {
  if (
    !slot ||
    suryaCompleted ||
    activePosition === null ||
    slot.dataset.filled === "true"
  ) {
    return;
  }

  const slotPosition = Number(slot.getAttribute("r"));

  if (slotPosition !== activePosition) {
    wrongtries++;

    document.getElementById("wt").textContent =
    devanagari(wrongtries);

    document.getElementById("placement-feedback").textContent =
    "Not quite. Try another position.";

    return;
  }

  const word = m1[activePosition - 1];

  slot.querySelector(".slot-word").textContent = word;
  slot.dataset.filled = "true";
  slot.classList.add("is-filled");

  filled.push(word);
  m2 = m1.filter((invocation) => !filled.includes(invocation));
  activePosition = null;

  document.getElementById("p").value = filled.length;
  document.getElementById("progress-text").textContent =
  devanagari(filled.length) + " / १२";

  const source = document.getElementById("new");
  source.draggable = false;
  source.hidden = true;
  source.removeAttribute("pos");

  document.getElementById("trans").hidden = true;

  if (filled.length === 12) {
    completeSuryaGame();
    return;
  }

  // Immediately display the next unplaced invocation.
  showInvocation();
}

function completeSuryaGame() {
  if (suryaCompleted) return;

  suryaCompleted = true;

  suryaFinalScore = Math.round(
    (12 / (12 + wrongtries)) * 100
  );

  const startButton = document.getElementById("start-button");
  startButton.textContent = "Completed";
  startButton.disabled = true;
  startButton.hidden = false;

  document.getElementById("new").draggable = false;

  document.getElementById("placement-feedback").textContent =
  "All twelve positions are complete!";

  setSun("sun.png");

  document.getElementById("surya-final-score").textContent =
  suryaFinalScore + " / 100";

  document.getElementById("surya-result-details").textContent =
  (12 + wrongtries) +
  " total attempts · " +
  wrongtries +
  " wrong attempts";

  const result = document.getElementById("surya-result");
  result.showModal();

  document.getElementById("surya-result-title").focus({
      preventScroll: true,
  });

  saveSuryaScore();
}

async function saveSuryaScore() {
  if (!suryaCompleted || suryaSaving || suryaSaved) return;

  suryaSaving = true;

  const status = document.getElementById("surya-save-status");
  const retry = document.getElementById("surya-retry");
  const playAgain = document.getElementById("surya-play-again");

  status.textContent = "Submitting your score…";
  retry.hidden = true;
  playAgain.disabled = true;

  try {
    const api = await loadSuryaScoring();

    const result = await api.submitGameScore(
      suryaFinalScore,
      {
        result: "completed",
        metrics: {
          contentSet: set,
          correctPlacements: filled.length,
          wrongAttempts: wrongtries,
          totalAttempts: filled.length + wrongtries,
          playElapsedSeconds: Math.floor(
            (Date.now() - suryaStartedAt) / 1000
          ),
        },
      }
    );

    if (result.ok || result.reason === "already-submitted") {
      suryaSaved = true;
      status.textContent = "Your score has been submitted!";
    } else {
      status.textContent =
      result.reason === "not-signed-in"
      ? "Sign in to Zat.am, then retry saving your score."
      : "Your score could not be saved. Please retry.";

      retry.hidden = false;
    }
  } catch (error) {
    console.error("Surya score submission failed:", error);

    status.textContent =
    "Could not submit your score. Check your connection and retry.";

    retry.hidden = false;
  } finally {
    suryaSaving = false;
    playAgain.disabled = false;
  }
}

var selectedPosition = 1;

function chargearray() {
  circleArray.forEach((circle) => {
      const fixedAngle = 30 + Number(circle.dataset.angle);
      const position = Number(circle.getAttribute("r"));

      circle.style.transform =
      `rotate(${fixedAngle}deg) ` +
      `translate(240px) ` +
      `rotate(${-fixedAngle}deg)`;

      circle.classList.toggle(
        "one",
        position === selectedPosition
      );
  });
}

function getSelectedSlot() {
  return Array.from(circleArray).find(
    (slot) => Number(slot.getAttribute("r")) === selectedPosition
  );
}

document.addEventListener("keydown", function (event) {
    if (event.defaultPrevented || suryaCompleted) return;

    const target = event.target;

    if (
      target.matches("input, textarea, select") ||
      target.isContentEditable
    ) {
      return;
    }

    const button = target.closest("button");

    if (
      target.closest("a") ||
      (button && button.id !== "start-button")
    ) {
      return;
    }

    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight"
    ) {
      event.preventDefault();

      selectedPosition =
      event.key === "ArrowLeft"
      ? (selectedPosition === 1 ? 12 : selectedPosition - 1)
      : (selectedPosition === 12 ? 1 : selectedPosition + 1);

      chargearray();
      getSelectedSlot().focus({ preventScroll: true });
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (event.repeat) return;

      if (activePosition === null || button?.id === "start-button") {
        showInvocation();

        // Move keyboard control to the selected board position.
        getSelectedSlot().focus({ preventScroll: true });
        return;
      }

      placeInvocation(getSelectedSlot());
    }
});

circleArray.forEach((slot) => {
    slot.setAttribute("role", "button");
    slot.setAttribute("tabindex", "0");

    slot.addEventListener("focus", () => {
        selectedPosition = Number(slot.getAttribute("r"));
        chargearray();
    });

    slot.addEventListener("click", () => {
        selectedPosition = Number(slot.getAttribute("r"));
        chargearray();
        placeInvocation(slot);
    });
});

chargearray();
