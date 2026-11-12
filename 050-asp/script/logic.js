const SCROLL_INTERVAL_MS = 64;
const INITIAL_SPEED = 1;
const SPEED_STEP = 0.1;
const MIN_SPEED = 0.1;
const START_DELAY_MS = 2400;
const READING_STORAGE_KEY = "zatam-050-reading-progress";

const VERSE_URL =
  "https://raw.githubusercontent.com/gita/gita/refs/heads/main/data/verse.json";

let savedReading = null;
let saveProgressTimeout = null;

let scrollSpeed = INITIAL_SPEED;
let scrollInterval = null;
let startTimeout = null;
let verseData = [];
let selectedVerses = [];
let chapters = [];

let isHovered = false;
let isCompleted = false;
let isLoaded = false;
let isReading = false;
let scrollPosition = 0;
let selectedChapter = null;

let reader;
let speedDisplay;
let statusDisplay;
let decreaseButton;
let selectionPanel;
let readerPanel;
let chapterPicker;
let chapterSelect;
let selectionStatus;
let startButton;
let retryButton;


const stopHoldHandlers = [];

function updateSpeedDisplay() {
  const current = scrollSpeed * (1000 / SCROLL_INTERVAL_MS);
  const step = SPEED_STEP * (1000 / SCROLL_INTERVAL_MS);

  speedDisplay.textContent =
    `Current speed: ${current.toFixed(2)} px/s · ` +
    `Each step changes speed by ${step.toFixed(2)} px/s`;

  decreaseButton.disabled = scrollSpeed <= MIN_SPEED;
}

function changeSpeed(direction) {
  const previous = scrollSpeed;

  scrollSpeed = Math.max(
    MIN_SPEED,
    Math.round((scrollSpeed + direction * SPEED_STEP) * 10) / 10
  );

  updateSpeedDisplay();

  const change =
    Math.abs(scrollSpeed - previous) *
    (1000 / SCROLL_INTERVAL_MS);

  document.getElementById("speed-change").textContent =
    change === 0
      ? "Minimum speed reached."
      : `${direction > 0 ? "Increased" : "Decreased"} speed by ` +
        `${change.toFixed(2)} px/s.`;
}

function changeFontSize(size) {
  if (!["small", "medium", "large"].includes(size)) return;

  document.getElementById("verse").dataset.fontSize = size;
}

function pauseScrolling() {
  clearInterval(scrollInterval);
  scrollInterval = null;
}

function cancelDelayedStart() {
  clearTimeout(startTimeout);
  startTimeout = null;
}

function stopAllHolds() {
  stopHoldHandlers.forEach((stop) => stop());
}

function completeReading() {
  pauseScrolling();
  isCompleted = true;

  statusDisplay.textContent =
    selectedChapter === null
      ? "You have finished all shlokas. Restart or choose another reading."
      : `You have finished Chapter ${selectedChapter}. ` +
        "Restart or choose another chapter.";
}

function resetSpeed() {
  stopAllHolds();
  scrollSpeed = INITIAL_SPEED;
  updateSpeedDisplay();

  document.getElementById("speed-change").textContent =
    "Speed reset to the original 15.63 px/s.";

  saveReadingProgress();
}

function saveReadingProgress() {
  if (!isReading || !selectedVerses.length) return;

  // Save the visible shloka and the position within it.
  // This also works when the window size changes.
  const shlokas = [...document.querySelectorAll("#verse .shloka-text")];
  const readerTop = reader.getBoundingClientRect().top + reader.clientTop;

  let verseIndex = shlokas.findIndex(
    (shloka) => shloka.getBoundingClientRect().bottom > readerTop
  );

  if (verseIndex < 0) verseIndex = shlokas.length - 1;

  const bounds = shlokas[verseIndex].getBoundingClientRect();

  const progress = {
    chapter: selectedChapter,
    verseIndex,
    verseOffset: Math.max(
      0,
      Math.min(1, (readerTop - bounds.top) / Math.max(bounds.height, 1))
    ),
    speed: scrollSpeed,
    fontSize: document.getElementById("font-size-select").value,
    completed: isCompleted
  };

  try {
    localStorage.setItem(READING_STORAGE_KEY, JSON.stringify(progress));
    savedReading = progress;
  } catch (error) {
    console.warn("Reading progress could not be saved:", error);
  }
}

function loadSavedReading() {
  try {
    const progress = JSON.parse(
      localStorage.getItem(READING_STORAGE_KEY)
    );

    if (
      !progress ||
      !Number.isInteger(progress.verseIndex) ||
      progress.verseIndex < 0 ||
      !Number.isFinite(progress.verseOffset) ||
      !Number.isFinite(progress.speed) ||
      !["small", "medium", "large"].includes(progress.fontSize) ||
      !(
        progress.chapter === null ||
        Number.isInteger(progress.chapter)
      )
    ) {
      return;
    }

    savedReading = progress;
  } catch (error) {
    console.warn("Saved reading could not be loaded:", error);
  }
}

function updateResumeOptions() {
  const available =
    isLoaded &&
    savedReading !== null &&
    (
      savedReading.chapter === null ||
      chapters.includes(savedReading.chapter)
    );

  document.getElementById("resume-options").hidden = !available;
  document.getElementById("resume-reading").disabled = !available;
  document.getElementById("start-over").disabled = !available;

  if (!available) return;

  const readingName = savedReading.chapter === null
    ? "All shlokas"
    : `Chapter ${savedReading.chapter}`;

  document.getElementById("resume-description").textContent =
    `${readingName} — your previous reading position is saved.`;
}

function openSavedReading(fromBeginning = false) {
  if (!isLoaded || !savedReading) return;

  // Keep a copy because starting a reading updates the saved progress.
  const progress = { ...savedReading };

  const mode = progress.chapter === null ? "all" : "chapter";

  document.querySelector(
    `input[name="reading-mode"][value="${mode}"]`
  ).checked = true;

  if (progress.chapter !== null) {
    chapterSelect.value = String(progress.chapter);
  }

  scrollSpeed = Math.max(MIN_SPEED, progress.speed);
  updateSpeedDisplay();

  document.getElementById("font-size-select").value = progress.fontSize;
  changeFontSize(progress.fontSize);

  updateReadingOptions();
  beginSelectedReading();

  if (!fromBeginning) {
    const shlokas = document.querySelectorAll("#verse .shloka-text");
    const index = Math.min(progress.verseIndex, shlokas.length - 1);
    const shloka = shlokas[index];

    if (shloka) {
      const readerTop =
        reader.getBoundingClientRect().top + reader.clientTop;
      const bounds = shloka.getBoundingClientRect();

      reader.scrollTop +=
        bounds.top - readerTop +
        bounds.height * Math.max(0, Math.min(1, progress.verseOffset));

      scrollPosition = reader.scrollTop;
    }

    if (progress.completed) {
      cancelDelayedStart();
      completeReading();
    }
  }

  saveReadingProgress();
}

function startScrolling() {
  pauseScrolling();

  if (!isReading || !isLoaded || isHovered || isCompleted) return;

  scrollPosition = reader.scrollTop;
  statusDisplay.textContent =
    "Reading… Hover over the verses to pause.";

  scrollInterval = setInterval(() => {
    const maximum = Math.max(
      0,
      reader.scrollHeight - reader.clientHeight
    );

    if (reader.scrollTop >= maximum - 1) {
      completeReading();
      return;
    }

    // Keep fractional movement so very slow speeds still work.
    scrollPosition = Math.min(
      scrollPosition + scrollSpeed,
      maximum
    );

    reader.scrollTop = scrollPosition;

    if (scrollPosition >= maximum) {
      completeReading();
    }
  }, SCROLL_INTERVAL_MS);
}

function scheduleScrolling() {
  cancelDelayedStart();

  startTimeout = setTimeout(() => {
    startTimeout = null;
    startScrolling();
  }, START_DELAY_MS);
}

function resumeScrolling() {
  if (!isReading || !isLoaded || isCompleted) return;

  if (startTimeout !== null) {
    statusDisplay.textContent = "Scrolling will start shortly.";
    return;
  }

  startScrolling();
}

function getChapterNumber(verse) {
  return Number(verse.chapter_number ?? verse.chapter_id);
}

function getReadingMode() {
  return document.querySelector(
    'input[name="reading-mode"]:checked'
  ).value;
}

function updateReadingOptions() {
  const chapterMode = getReadingMode() === "chapter";

  chapterPicker.hidden = !chapterMode;
  chapterSelect.disabled = !isLoaded || !chapterMode;
  startButton.disabled = !isLoaded;

  if (!isLoaded) return;

  if (!chapterMode) {
    selectionStatus.textContent =
      `${verseData.length} shlokas across ${chapters.length} chapters.`;
    return;
  }

  const chapter = Number(chapterSelect.value);
  const count = verseData.filter(
    (verse) => getChapterNumber(verse) === chapter
  ).length;

  selectionStatus.textContent =
    `Chapter ${chapter}: ${count} shlokas.`;
}

async function loadVerses() {
  isLoaded = false;
  startButton.disabled = true;
  chapterSelect.disabled = true;
  retryButton.hidden = true;
  selectionStatus.textContent = "Loading verses…";

  try {
    const response = await fetch(VERSE_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("The verse data is empty or invalid.");
    }

    // Order chapters numerically and verses in their reading order.
    verseData = data
      .filter(
        (verse) =>
          Number.isFinite(getChapterNumber(verse)) &&
          typeof verse.text === "string"
      )
      .sort(
        (a, b) =>
          getChapterNumber(a) - getChapterNumber(b) ||
          Number(a.verse_order ?? a.verse_number ?? a.id) -
            Number(b.verse_order ?? b.verse_number ?? b.id)
      );

    if (verseData.length === 0) {
      throw new Error("No readable verses were found.");
    }

    chapters = [...new Set(verseData.map(getChapterNumber))];

    chapterSelect.replaceChildren();

    chapters.forEach((chapter) => {
      const count = verseData.filter(
        (verse) => getChapterNumber(verse) === chapter
      ).length;

      const option = document.createElement("option");
      option.value = chapter;
      option.textContent = `Chapter ${chapter} (${count} shlokas)`;
      chapterSelect.appendChild(option);
    });

    isLoaded = true;
    updateReadingOptions();
    updateResumeOptions();
  } catch (error) {
    console.error("Error loading verses:", error);
    selectionStatus.textContent =
      "Unable to load verses. Check your connection and try again.";
    retryButton.hidden = false;
  }
}

function showVerse() {
  // Keep #verse itself so its selected font size is preserved.
  const fragment = document.createDocumentFragment();

  selectedVerses.forEach((verse) => {
    const text = document.createElement("span");
    text.className = "shloka-text";
    text.textContent = verse.text.trim();

    fragment.appendChild(text);
  });

  document.getElementById("verse").replaceChildren(fragment);
}

function beginSelectedReading() {
  if (!isLoaded) return;

  pauseScrolling();
  cancelDelayedStart();
  stopAllHolds();

  selectedChapter =
    getReadingMode() === "chapter"
      ? Number(chapterSelect.value)
      : null;

  selectedVerses =
    selectedChapter === null
      ? verseData
      : verseData.filter(
          (verse) => getChapterNumber(verse) === selectedChapter
        );

  if (selectedVerses.length === 0) {
    selectionStatus.textContent =
      "No verses were found for this selection.";
    return;
  }

  isCompleted = false;
  isReading = true;

  selectionPanel.hidden = true;
  readerPanel.hidden = false;

  document.getElementById("reader-title").textContent =
    selectedChapter === null
      ? "श्रीमद् भगवद्गीता — All Shlokas"
      : `श्रीमद् भगवद्गीता — Chapter ${selectedChapter}`;

  showVerse();

  reader.scrollTop = 0;
  scrollPosition = 0;
  isHovered = reader.matches(":hover");

  document.getElementById("speed-change").textContent = "";

  statusDisplay.textContent = isHovered
    ? "Paused. Move your pointer outside the reader to resume."
    : "Scrolling will start in 2.4 seconds.";

  scheduleScrolling();
  saveReadingProgress();
}

function verseRestart() {
  if (!isReading) return;

  pauseScrolling();
  cancelDelayedStart();
  stopAllHolds();

  isCompleted = false;
  reader.scrollTop = 0;
  scrollPosition = 0;
  isHovered = reader.matches(":hover");

  statusDisplay.textContent = isHovered
    ? "Restarted. Move your pointer outside the reader to resume."
    : "Restarted. Scrolling will start in 2.4 seconds.";

  scheduleScrolling();
  saveReadingProgress();
}

function changeReading() {
  saveReadingProgress();
  pauseScrolling();
  cancelDelayedStart();
  stopAllHolds();

  isReading = false;
  isCompleted = false;
  isHovered = false;

  readerPanel.hidden = true;
  selectionPanel.hidden = false;

  updateReadingOptions();
  document.getElementById("selection-title").focus();
  updateResumeOptions();
}

function setupHoldSpeedButton(button, direction) {
  let holdTimeout = null;
  let repeatInterval = null;
  let activePointerId = null;

  function stopHolding() {
    clearTimeout(holdTimeout);
    clearInterval(repeatInterval);

    holdTimeout = null;
    repeatInterval = null;
    activePointerId = null;
  }

  stopHoldHandlers.push(stopHolding);

  button.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0 || button.disabled) return;

    stopAllHolds();

    activePointerId = event.pointerId;
    button.setPointerCapture(event.pointerId);

    changeSpeed(direction);

    if (button.disabled) {
      stopHolding();
      return;
    }

    holdTimeout = setTimeout(() => {
      repeatInterval = setInterval(() => {
        if (button.disabled || !isReading) {
          stopHolding();
          return;
        }

        changeSpeed(direction);

        if (button.disabled) stopHolding();
      }, 100);
    }, 350);
  });

  function stopForPointer(event) {
    if (event.pointerId === activePointerId) stopHolding();
  }

  window.addEventListener("pointerup", stopForPointer);
  window.addEventListener("pointercancel", stopForPointer);
  button.addEventListener("lostpointercapture", stopHolding);

  button.addEventListener("click", (event) => {
    if (event.detail === 0 && !button.disabled) {
      changeSpeed(direction);
    }
  });

  button.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  reader = document.getElementById("vScroll");
  speedDisplay = document.getElementById("speed-display");
  statusDisplay = document.getElementById("reader-status");
  decreaseButton = document.querySelector(".buttons .decrease");

  selectionPanel = document.getElementById("reading-selection");
  readerPanel = document.getElementById("reader-panel");
  chapterPicker = document.getElementById("chapter-picker");
  chapterSelect = document.getElementById("chapter-select");
  selectionStatus = document.getElementById("selection-status");
  startButton = document.getElementById("start-reading");
  retryButton = document.getElementById("retry-loading");

  document.getElementById("selection-title").tabIndex = -1;

  updateSpeedDisplay();

  setupHoldSpeedButton(
    document.querySelector(".buttons .increase"),
    1
  );

  setupHoldSpeedButton(decreaseButton, -1);

  document.querySelectorAll('input[name="reading-mode"]').forEach(
    (input) => {
      input.addEventListener("change", updateReadingOptions);
    }
  );

  chapterSelect.addEventListener("change", updateReadingOptions);
  startButton.addEventListener("click", beginSelectedReading);
  retryButton.addEventListener("click", loadVerses);

  document.getElementById("change-reading").addEventListener(
    "click",
    changeReading
  );

  reader.addEventListener("mouseenter", () => {
    isHovered = true;
    pauseScrolling();

    if (isReading && !isCompleted) {
      statusDisplay.textContent =
        "Paused. Move your pointer outside the reader to resume.";
    }
  });

  reader.addEventListener("mouseleave", () => {
    isHovered = false;
    resumeScrolling();
  });

  // Update the fractional position only for manual scrolling.
  // Automatic scrolling must retain its fractional remainder.
  reader.addEventListener("wheel", () => {
    pauseScrolling();
    requestAnimationFrame(() => {
      scrollPosition = reader.scrollTop;
      if (!isHovered) resumeScrolling();
    });
  }, { passive: true });

  window.addEventListener("blur", stopAllHolds);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAllHolds();
  });

  const fontSelect = document.getElementById("font-size-select");

  if (fontSelect) {
    changeFontSize(fontSelect.value);
  }

  loadSavedReading();

  document.getElementById("resume-reading").addEventListener("click", () => {
    openSavedReading(false);
  });

  document.getElementById("start-over").addEventListener("click", () => {
    openSavedReading(true);
  });

  reader.addEventListener("scroll", () => {
    clearTimeout(saveProgressTimeout);
    saveProgressTimeout = setTimeout(saveReadingProgress, 250);
  });

  setInterval(saveReadingProgress, 2000);

  window.addEventListener("pagehide", saveReadingProgress);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) saveReadingProgress();
  });

  updateReadingOptions();
  loadVerses();
});