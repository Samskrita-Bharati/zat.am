// =====================================================
// SHARED NAVBAR LOADER
// =====================================================

const projectRoot = new URL("../", import.meta.url);

const navbarHtmlUrl = new URL("../shared/navbar.html", import.meta.url);

const navbarCssUrl = new URL("../shared/navbar.css", import.meta.url);

// =====================================================
// DETECT NORMAL ZAT.AM GAME PAGES
//
// Main homepage also uses data-page="games", so that
// alone is not enough. A normal game lives inside a
// child folder such as:
//
//   /001-sbg/
//   /003-ssc/
//   /057-gita-typing/
//
// BP26 is excluded because it has its own integration.
// =====================================================

function getRelativePagePath() {
  const currentUrl = new URL(window.location.href);

  let rootPath = projectRoot.pathname;

  if (!rootPath.endsWith("/")) {
    rootPath += "/";
  }

  if (!currentUrl.pathname.startsWith(rootPath)) {
    return "";
  }

  return currentUrl.pathname.slice(rootPath.length).replace(/^\/+/, "");
}

function isMainGamePage() {
  if (!document.body) {
    return false;
  }

  if (document.body.dataset.page !== "games") {
    return false;
  }

  const relativePath = getRelativePagePath();

  // Root homepage:
  // /index24.html
  // or /
  if (!relativePath || !relativePath.includes("/")) {
    return false;
  }

  const firstDirectory = relativePath.split("/")[0];

  if (!firstDirectory) {
    return false;
  }

  // BP26 has its own navbar behavior.
  if (firstDirectory === "bp26") {
    return false;
  }

  return true;
}

// =====================================================
// PREPARE GAME PAGE
// =====================================================

function prepareGamePage() {
  if (!isMainGamePage()) {
    return false;
  }

  const body = document.body;

  // Preserve any top padding the original game already had.
  const originalPaddingTop = window.getComputedStyle(body).paddingTop || "0px";

  body.style.setProperty(
    "--zatam-original-body-padding-top",
    originalPaddingTop,
  );

  body.classList.add("zatam-game-page");

  return true;
}

// =====================================================
// LOAD NAVBAR CSS
// =====================================================

function loadNavbarStyles() {
  const existing = document.querySelector("link[data-zatam-navbar-css]");

  if (existing) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const link = document.createElement("link");

    link.rel = "stylesheet";

    link.href = navbarCssUrl.href;

    link.dataset.zatamNavbarCss = "true";

    link.addEventListener("load", () => resolve(), { once: true });

    link.addEventListener("error", () => resolve(), { once: true });

    document.head.appendChild(link);
  });
}

// =====================================================
// RESOLVE ROUTES
// =====================================================

function resolveNavbarRoutes(navbar) {
  navbar.querySelectorAll("[data-route]").forEach((element) => {
    const route = element.dataset.route;

    const resolvedUrl = new URL(route, projectRoot).href;

    if (element.tagName === "A") {
      element.href = resolvedUrl;
    } else {
      element.dataset.href = resolvedUrl;
    }
  });
}

// =====================================================
// ACTIVE NAV ITEM
// =====================================================

function setActiveNavbarItem(navbar) {
  const page = document.body.dataset.page;

  navbar.querySelectorAll("[data-nav-page]").forEach((link) => {
    link.classList.toggle("active", link.dataset.navPage === page);
  });
}

// =====================================================
// KEEP GAME CONTENT BELOW FIXED NAVBAR
// =====================================================

function setupGameNavbarHeight(navbar) {
  if (!document.body.classList.contains("zatam-game-page")) {
    return;
  }

  const header = navbar.querySelector(".zatam-header");

  if (!header) {
    return;
  }

  const updateHeight = () => {
    const height = Math.ceil(header.getBoundingClientRect().height);

    if (height <= 0) {
      return;
    }

    document.body.style.setProperty("--zatam-navbar-height", `${height}px`);

    window.dispatchEvent(
      new CustomEvent("zatam:navbarresize", {
        detail: {
          height,
        },
      }),
    );
  };

  updateHeight();

  requestAnimationFrame(updateHeight);

  window.addEventListener("load", updateHeight, { once: true });

  window.addEventListener("resize", updateHeight, { passive: true });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(header);
  }

  // Helpful for old games/fonts that finish laying out
  // after the navbar has already been injected.
  window.setTimeout(updateHeight, 100);

  window.setTimeout(updateHeight, 500);
}

// =====================================================
// LOAD NAVBAR
// =====================================================

export async function loadNavbar() {
  const mount = document.getElementById("navbar-mount");

  if (!mount) {
    console.warn("Navbar mount not found.");

    return;
  }

  try {
    const gamePage = prepareGamePage();

    await loadNavbarStyles();

    const response = await fetch(navbarHtmlUrl.href);

    if (!response.ok) {
      throw new Error(`Navbar request failed: ${response.status}`);
    }

    mount.innerHTML = await response.text();

    resolveNavbarRoutes(mount);

    setActiveNavbarItem(mount);

    setupGameNavbarHeight(mount);

    // Import only AFTER navbar HTML exists.
    const { initNavbarAuth } = await import("./navbar-auth.js");

    await initNavbarAuth();

    // Auth state or translated labels can slightly affect layout.
    if (gamePage) {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
      });
    }

    document.dispatchEvent(new CustomEvent("zatam:navbarready"));
  } catch (error) {
    console.error("Failed to load Zat.am navbar:", error);
  }
}

loadNavbar();
