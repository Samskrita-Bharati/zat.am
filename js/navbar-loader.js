// =====================================================
// SHARED NAVBAR LOADER
// =====================================================

const projectRoot = new URL("../", import.meta.url);

const navbarHtmlUrl = new URL("../shared/navbar.html", import.meta.url);

const navbarCssUrl = new URL("../shared/navbar.css", import.meta.url);

// =====================================================
// LOAD NAVBAR CSS
// =====================================================

function loadNavbarStyles() {
  if (document.querySelector("link[data-zatam-navbar-css]")) {
    return;
  }

  const link = document.createElement("link");

  link.rel = "stylesheet";

  link.href = navbarCssUrl.href;

  link.dataset.zatamNavbarCss = "true";

  document.head.appendChild(link);
}

// =====================================================
// RESOLVE ROUTES
//
// This is better than hard-coding "/zat.am".
// It works from your real domain and from a
// subdirectory deployment.
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
// LOAD NAVBAR
// =====================================================

export async function loadNavbar() {
  const mount = document.getElementById("navbar-mount");

  if (!mount) {
    console.warn("Navbar mount not found.");

    return;
  }

  try {
    loadNavbarStyles();

    const response = await fetch(navbarHtmlUrl.href);

    if (!response.ok) {
      throw new Error(`Navbar request failed: ${response.status}`);
    }

    mount.innerHTML = await response.text();

    resolveNavbarRoutes(mount);

    setActiveNavbarItem(mount);

    // Import only AFTER navbar HTML exists.
    const { initNavbarAuth } = await import("./navbar-auth.js");

    await initNavbarAuth();

    document.dispatchEvent(new CustomEvent("zatam:navbarready"));
  } catch (error) {
    console.error("Failed to load Zat.am navbar:", error);
  }
}

loadNavbar();
