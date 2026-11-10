const SCROLL_INTERVAL_MS = 64;
const INITIAL_SPEED = 1;
const SPEED_STEP = 0.1;
const MIN_SPEED = 0.1;
const START_DELAY_MS = 2400;

let scrollSpeed = INITIAL_SPEED;
let scrollInterval = null;
let startTimeout = null;
let verseData = [];
let isHovered = false;
let isCompleted = false;
let isLoaded = false;
let scrollPosition = 0;

let reader;
let speedDisplay;
let statusDisplay;
let decreaseButton;

function updateSpeedDisplay() {
  const pixelsPerSecond = scrollSpeed * (1000 / SCROLL_INTERVAL_MS);
  const stepPerSecond = SPEED_STEP * (1000 / SCROLL_INTERVAL_MS);

  speedDisplay.textContent =
    `Current speed: ${pixelsPerSecond.toFixed(2)} px/s · ` +
    `Each click changes speed by ${stepPerSecond.toFixed(2)} px/s`;

  decreaseButton.disabled = scrollSpeed <= MIN_SPEED;
}

function pauseScrolling() {
  clearInterval(scrollInterval);
  scrollInterval = null;
}

function cancelDelayedStart() {
  clearTimeout(startTimeout);
  startTimeout = null;
}

function completeReading() {
  pauseScrolling();
  isCompleted = true;
  statusDisplay.textContent =
    "You have reached the end of the Bhagavad Gita. Press Restart to read again.";
}

function startScrolling() {
  // Always clear the previous timer before creating another.
  pauseScrolling();

  if (!isLoaded || isHovered || isCompleted) return;

  scrollPosition = reader.scrollTop;

  scrollInterval = setInterval(() => {
    const maxScroll = Math.max(
      0,
      reader.scrollHeight - reader.clientHeight
    );

    if (reader.scrollTop >= maxScroll - 1) {
      completeReading();
      return;
    }

    // Preserve fractional movement for slow speeds.
    scrollPosition = Math.min(scrollPosition + scrollSpeed, maxScroll);
    reader.scrollTop = scrollPosition;

    if (scrollPosition >= maxScroll) {
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
  if (!isLoaded || isCompleted) return;

  // Preserve the initial delay if it is still pending.
  if (startTimeout !== null) {
    statusDisplay.textContent = "Scrolling will start shortly.";
    return;
  }

  statusDisplay.textContent = "Reading… Hover over the verses to pause.";
  startScrolling();
}

async function fetchVerse() {
  const response = await fetch(
    "https://raw.githubusercontent.com/gita/gita/refs/heads/main/data/verse.json"
  );

  if (!response.ok) {
    throw new Error(`Could not load verses: HTTP ${response.status}`);
  }

  verseData = await response.json();
}

function showVerse() {
  const fragment = document.createDocumentFragment();

  verseData.forEach((verse) => {
    fragment.appendChild(document.createTextNode(verse.text));
    fragment.appendChild(document.createElement("br"));
  });

  document.getElementById("verse").replaceChildren(fragment);
}

function changeSpeed(direction) {
  const previousSpeed = scrollSpeed;

  scrollSpeed = Math.max(
    MIN_SPEED,
    Math.round((scrollSpeed + direction * SPEED_STEP) * 10) / 10
  );

  updateSpeedDisplay();

  const actualChange =
    Math.abs(scrollSpeed - previousSpeed) *
    (1000 / SCROLL_INTERVAL_MS);

  if (actualChange === 0) {
    document.getElementById("speed-change").textContent =
      "Minimum speed reached.";
    return;
  }

  document.getElementById("speed-change").textContent =
    `${direction > 0 ? "Increased" : "Decreased"} speed by ` +
    `${actualChange.toFixed(2)} px/s.`;
}

function verseRestart() {
  pauseScrolling();
  cancelDelayedStart();

  isCompleted = false;
  scrollPosition = 0;
  reader.scrollTop = 0;

  // Reuse the loaded verses; no extra fetch or rendering is needed.
  if (!isLoaded) {
    statusDisplay.textContent =
      "Verses are not loaded. Refresh the page to try again.";
    return;
  }

  statusDisplay.textContent = isHovered
    ? "Restarted. Move your pointer outside the reader to resume."
    : "Restarted. Scrolling will start in 2.4 seconds.";

  scheduleScrolling();
}

document.addEventListener("DOMContentLoaded", async () => {
  reader = document.getElementById("vScroll");
  speedDisplay = document.getElementById("speed-display");
  statusDisplay = document.getElementById("reader-status");
  decreaseButton = document.querySelector(".buttons .decrease");

  updateSpeedDisplay();

  // These events do not fire when moving between child elements.
  reader.addEventListener("mouseenter", () => {
    isHovered = true;
    pauseScrolling();

    if (isLoaded && !isCompleted) {
      statusDisplay.textContent =
        "Paused. Move your pointer outside the reader to resume.";
    }
  });

  reader.addEventListener("mouseleave", () => {
    isHovered = false;
    resumeScrolling();
  });

  // Keep automatic scrolling aligned after manual scrolling.
  reader.addEventListener("scroll", () => {
    scrollPosition = reader.scrollTop;
  });

  statusDisplay.textContent = "Loading verses…";

  try {
    await fetchVerse();
    showVerse();
    isLoaded = true;
    reader.scrollTop = 0;

    statusDisplay.textContent = isHovered
      ? "Paused. Move your pointer outside the reader to resume."
      : "Verses loaded. Scrolling will start in 2.4 seconds.";

    scheduleScrolling();
  } catch (error) {
    console.error("Error fetching verses:", error);
    statusDisplay.textContent =
      "Unable to load verses. Please refresh the page to try again.";
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

    button.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0 || button.disabled) return;

      stopHolding();

      activePointerId = event.pointerId;
      button.setPointerCapture(event.pointerId);

      // Apply one change immediately.
      changeSpeed(direction);

      holdTimeout = setTimeout(() => {
        repeatInterval = setInterval(() => {
          if (button.disabled) {
            stopHolding();
            return;
          }

          changeSpeed(direction);
        }, 100);
      }, 350);
    });

    function stopForPointer(event) {
      if (event.pointerId === activePointerId) {
        stopHolding();
      }
    }

    window.addEventListener("pointerup", stopForPointer);
    window.addEventListener("pointercancel", stopForPointer);
    button.addEventListener("lostpointercapture", stopHolding);
    window.addEventListener("blur", stopHolding);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopHolding();
    });

    // Keyboard and assistive-technology clicks.
    // Pointer clicks already changed the speed on pointerdown.
    button.addEventListener("click", (event) => {
      if (event.detail === 0 && !button.disabled) {
        changeSpeed(direction);
      }
    });

    // Prevent the touch-and-hold context menu.
    button.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupHoldSpeedButton(document.querySelector(".buttons .increase"), 1);
    setupHoldSpeedButton(document.querySelector(".buttons .decrease"), -1);
  });
});