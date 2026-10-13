// =====================================================
// ZAT.AM SHARED GOOGLE ANALYTICS
// =====================================================
//
// New Zat.am GA4 property:
// G-1BQ8752E44
//
// IMPORTANT:
// BP26 already uses:
// G-1QD88MYKWG
//
// This file DOES NOT remove or replace the existing
// BP26 Google Analytics configuration.
//
// Main Zat.am game metadata comes from the existing
// menu array in /app.js.
// =====================================================

import { menu } from "../app.js";

const ZATAM_GA_ID = "G-1BQ8752E44";

const projectRoot = new URL("../", import.meta.url);

const state = {
  initialized: false,
  disabled: false,
  gameViewSent: false,
  gameStartSent: false,
  gameCompleteSent: false,
};

// =====================================================
// GTAG SETUP
// =====================================================

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== "function") {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
}

function dataLayerHasCommand(command, value = null) {
  return window.dataLayer.some((entry) => {
    if (!entry) {
      return false;
    }

    if (entry[0] !== command) {
      return false;
    }

    if (value === null) {
      return true;
    }

    return entry[1] === value;
  });
}

function hasGoogleTagLoader() {
  return Array.from(document.scripts).some((script) => {
    if (!script.src) {
      return false;
    }

    try {
      const url = new URL(script.src, window.location.href);

      return (
        url.hostname === "www.googletagmanager.com" &&
        url.pathname === "/gtag/js"
      );
    } catch {
      return false;
    }
  });
}

function loadGoogleTagIfNeeded() {
  if (hasGoogleTagLoader()) {
    return;
  }

  const script = document.createElement("script");

  script.async = true;

  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    ZATAM_GA_ID,
  )}`;

  script.dataset.zatamGa = "true";

  document.head.appendChild(script);
}

function configureGoogleAnalytics() {
  ensureDataLayer();

  loadGoogleTagIfNeeded();

  // BP26 may already have called:
  // gtag("js", new Date())
  //
  // Only add it if nobody has initialized gtag yet.
  if (!dataLayerHasCommand("js")) {
    window.gtag("js", new Date());
  }

  // Configure ONLY the new Zat.am property.
  //
  // The existing BP26 property remains untouched.
  if (!dataLayerHasCommand("config", ZATAM_GA_ID)) {
    window.gtag("config", ZATAM_GA_ID);
  }
}

// =====================================================
// PATH HELPERS
// =====================================================

function getRelativePagePath() {
  const currentUrl = new URL(window.location.href);

  let rootPath = projectRoot.pathname;

  if (!rootPath.endsWith("/")) {
    rootPath += "/";
  }

  if (!currentUrl.pathname.startsWith(rootPath)) {
    return currentUrl.pathname.replace(/^\/+/, "");
  }

  return currentUrl.pathname.slice(rootPath.length).replace(/^\/+/, "");
}

// =====================================================
// PAGE TITLE
// =====================================================

function getPageTitle() {
  const title = document.title?.trim();

  // Ignore empty or generic/placeholder titles.
  if (title && title.toLowerCase() !== "unknown game") {
    return title;
  }

  const heading = document.querySelector("h1, .gameTitle, .game-title");

  const headingText = heading?.textContent?.trim();

  if (headingText) {
    return headingText;
  }

  return null;
}

// =====================================================
// GAME CATALOG
// =====================================================
//
// The main Zat.am homepage already has all game
// information in /app.js.
//
// We use the SAME menu here so developers only have
// one place to manage game titles and directories.
// =====================================================

function getCatalogGame(directories) {
  if (!directories || directories.length === 0) {
    return null;
  }

  const topLevelDirectory = directories[0];

  return (
    menu.find((item) => {
      return item.dir === topLevelDirectory;
    }) || null
  );
}

// =====================================================
// MAIN GAME PATH
// =====================================================

function getMainGameDirectories() {
  const relativePath = getRelativePagePath();

  if (!relativePath) {
    return [];
  }

  const parts = relativePath.split("/").filter(Boolean);

  if (parts.length === 0) {
    return [];
  }

  // BP26 uses its own game detection.
  if (parts[0] === "bp26") {
    return [];
  }

  const lastPart = parts[parts.length - 1];

  const lastPartIsFile = /\.[a-z0-9]+$/i.test(lastPart);

  return lastPartIsFile ? parts.slice(0, -1) : parts;
}

// =====================================================
// ANALYTICS DISABLE CHECK
// =====================================================
//
// In app.js:
//
// {
//   id: ...,
//   title: "...",
//   dir: "...",
//   analytics: false,
// }
//
// completely disables the NEW Zat.am GA property
// on that game's pages.
// =====================================================

function isAnalyticsDisabledForCurrentPage() {
  const directories = getMainGameDirectories();

  if (directories.length === 0) {
    return false;
  }

  const catalogGame = getCatalogGame(directories);

  return catalogGame?.analytics === false;
}

// =====================================================
// GAME DETECTION
// =====================================================

function getGameInfo() {
  const relativePath = getRelativePagePath();

  if (!relativePath) {
    return null;
  }

  const currentPath = window.location.pathname;

  const parts = relativePath.split("/").filter(Boolean);

  if (parts.length === 0) {
    return null;
  }

  // =====================================================
  // BP26
  // =====================================================

  if (parts[0] === "bp26") {
    // BP26 homepage:
    //
    // /bp26/
    // /bp26/index.html
    //
    // is not an individual game.
    if (
      parts.length === 1 ||
      (parts.length === 2 && /^index\.html?$/i.test(parts[1]))
    ) {
      return null;
    }

    const lastPart = parts[parts.length - 1];

    const slug = lastPart.replace(/\.html?$/i, "").trim();

    return {
      game_id: `bp26-${slug}`,
      game_name: getPageTitle() || `BP26 ${slug}`,
      game_group: "bp26",
      game_path: currentPath,
    };
  }

  // =====================================================
  // MAIN ZAT.AM
  // =====================================================

  const lastPart = parts[parts.length - 1];

  const lastPartIsFile = /\.[a-z0-9]+$/i.test(lastPart);

  const directories = lastPartIsFile ? parts.slice(0, -1) : parts;

  // Root pages such as:
  //
  // /index.html
  // /About.html
  // /Resources.html
  //
  // are not individual games.
  if (directories.length === 0) {
    return null;
  }

  // =====================================================
  // 021-a LAUNCHER
  // =====================================================
  //
  // /021-a/
  // /021-a/index.html
  //
  // is a launcher/menu.
  //
  // Its nested folders are the actual games:
  //
  // /021-a/1-li/
  // /021-a/2-ci/
  // /021-a/3-he/
  // =====================================================

  if (directories.length === 1 && directories[0] === "021-a") {
    return null;
  }

  // =====================================================
  // BUILD GAME ID
  // =====================================================

  const gameId = directories.join("-");

  // =====================================================
  // GET GAME FROM EXISTING app.js MENU
  // =====================================================

  const catalogGame = getCatalogGame(directories);

  // If analytics is explicitly disabled in app.js,
  // this page is not considered an Analytics game.
  if (catalogGame?.analytics === false) {
    return null;
  }

  // =====================================================
  // GAME NAME
  // =====================================================

  let gameName = null;

  // Nested games such as 021-a/1-li should use
  // their own page title first so each child game
  // can have its own Analytics name.
  if (directories.length > 1) {
    gameName = getPageTitle();

    if (!gameName) {
      const parentTitle = catalogGame?.title?.trim();

      if (parentTitle) {
        gameName = `${parentTitle} - ${directories.slice(1).join("-")}`;
      }
    }
  } else {
    // Normal Zat.am games use the canonical title
    // already defined in app.js.
    gameName = catalogGame?.title?.trim() || getPageTitle();
  }

  // Last-resort fallback.
  //
  // Never send "Unknown Game" to GA.
  if (!gameName) {
    gameName = gameId;
  }

  return {
    game_id: gameId,
    game_name: gameName,
    game_group: "main",
    game_path: currentPath,
  };
}

// =====================================================
// EVENT HELPERS
// =====================================================

function sendEvent(eventName, parameters = {}) {
  if (state.disabled) {
    return;
  }

  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, {
    ...parameters,

    // Send custom Zat.am events specifically
    // to the NEW property.
    send_to: ZATAM_GA_ID,
  });
}

function sendGameEvent(eventName, extra = {}) {
  const game = getGameInfo();

  if (!game) {
    return;
  }

  sendEvent(eventName, {
    game_id: game.game_id,
    game_name: game.game_name,
    game_group: game.game_group,
    game_path: game.game_path,
    ...extra,
  });
}

// =====================================================
// PUBLIC GAME TRACKING FUNCTIONS
// =====================================================

export function trackGameView() {
  if (state.disabled || state.gameViewSent) {
    return;
  }

  const game = getGameInfo();

  if (!game) {
    return;
  }

  state.gameViewSent = true;

  sendGameEvent("game_view");
}

export function trackGameStart(extra = {}) {
  if (state.disabled || state.gameStartSent) {
    return;
  }

  const game = getGameInfo();

  if (!game) {
    return;
  }

  state.gameStartSent = true;

  sendGameEvent("game_start", extra);
}

export function trackGameComplete(extra = {}) {
  if (state.disabled || state.gameCompleteSent) {
    return;
  }

  const game = getGameInfo();

  if (!game) {
    return;
  }

  state.gameCompleteSent = true;

  sendGameEvent("game_complete", extra);
}

export function trackScoreSubmit(score, extra = {}) {
  if (state.disabled) {
    return;
  }

  const numericScore = Number(score);

  sendGameEvent("score_submit", {
    score: Number.isFinite(numericScore) ? numericScore : undefined,

    ...extra,
  });
}

export function trackZatamEvent(eventName, parameters = {}) {
  sendEvent(eventName, parameters);
}

// =====================================================
// EXPOSE PUBLIC API
// =====================================================

function exposeAnalyticsApi() {
  window.zatamAnalytics = {
    trackGameView,
    trackGameStart,
    trackGameComplete,
    trackScoreSubmit,
    trackEvent: trackZatamEvent,
    getGameInfo,
    measurementId: ZATAM_GA_ID,
  };
}

// =====================================================
// INITIALIZE
// =====================================================

export function initGoogleAnalytics({ context = "site" } = {}) {
  if (state.initialized) {
    return;
  }

  state.initialized = true;

  // =====================================================
  // ANALYTICS DISABLED FOR THIS GAME
  // =====================================================
  //
  // IMPORTANT:
  // This check happens BEFORE configuring the new
  // Google Analytics property.
  //
  // Therefore a game with:
  //
  // analytics: false
  //
  // will not send:
  //
  // - automatic page_view
  // - zatam_page_view
  // - game_view
  // - game_start
  // - game_complete
  // - score_submit
  //
  // to the NEW Zat.am property.
  // =====================================================

  if (isAnalyticsDisabledForCurrentPage()) {
    state.disabled = true;

    exposeAnalyticsApi();

    console.info("[Zat.am Analytics] Disabled for this game", {
      path: window.location.pathname,
    });

    return;
  }

  // =====================================================
  // CONFIGURE GOOGLE ANALYTICS
  // =====================================================

  configureGoogleAnalytics();

  // =====================================================
  // GENERAL ZAT.AM PAGE EVENT
  // =====================================================

  sendEvent("zatam_page_view", {
    zatam_context: context,
    page_path: window.location.pathname,
    page_title: document.title || "",
  });

  // =====================================================
  // INDIVIDUAL GAME VIEW
  // =====================================================

  trackGameView();

  // =====================================================
  // MAKE FUNCTIONS AVAILABLE TO OLD/NON-MODULE GAMES
  // =====================================================

  exposeAnalyticsApi();

  // =====================================================
  // DEBUG
  // =====================================================

  console.info("[Zat.am Analytics] Initialized", {
    measurementId: ZATAM_GA_ID,
    context,
    game: getGameInfo(),
  });
}
