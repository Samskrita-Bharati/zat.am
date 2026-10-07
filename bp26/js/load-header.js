/*
=================================================
BP26 SHARED NAVBAR LOADER
=================================================

Uses the MAIN Zat.am shared navbar.

BP26 homepage:
  BP26 logo -> ../index24.html

BP26 games:
  BP26 logo -> ./index.html

All BP26 pages:
  Contest nav item is active.
=================================================
*/

(function () {
  /*
  -------------------------------------------------
  PATHS
  -------------------------------------------------
  */

  const loaderScript = document.currentScript;

  const loaderUrl = loaderScript?.src
    ? new URL(loaderScript.src)
    : new URL("./js/load-header.js", window.location.href);

  /*
  load-header.js is:

  /bp26/js/load-header.js

  so:

  ../   = /bp26/
  ../../ = site root
  */

  const bp26Root = new URL("../", loaderUrl);

  const siteRoot = new URL("../../", loaderUrl);

  const navbarHtmlUrl = new URL("shared/navbar.html", siteRoot);

  const navbarAuthUrl = new URL("js/navbar-auth.js", siteRoot);

  /*
  -------------------------------------------------
  RESOLVE MAIN-SITE ROUTES
  -------------------------------------------------

  shared/navbar.html uses:

  data-route="index24.html"
  data-route="About.html"
  data-route="Resources.html"
  etc.

  Since we are inside /bp26/, these must
  resolve from the SITE ROOT, not bp26.
  */

  function resolveNavbarRoutes(navbar) {
    navbar.querySelectorAll("[data-route]").forEach(function (element) {
      const route = element.dataset.route;

      if (!route) {
        return;
      }

      const resolvedUrl = new URL(route, siteRoot).href;

      if (element.tagName === "A") {
        element.href = resolvedUrl;
      } else {
        /*
            Login / signup buttons use
            data-href in navbar-auth.js.
            */

        element.dataset.href = resolvedUrl;
      }
    });
  }

  /*
  -------------------------------------------------
  DETECT BP26 HOMEPAGE
  -------------------------------------------------
  */

  function isBp26HomePage() {
    let path = window.location.pathname;

    /*
    Remove trailing slash except
    for the site root.
    */

    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }

    return path.endsWith("/bp26") || path.endsWith("/bp26/index.html");
  }

  /*
  -------------------------------------------------
  BP26 LOGO
  -------------------------------------------------

  Main shared navbar normally shows the
  Zat.am logo.

  For every BP26 page we replace it with
  bp26c.png.

  IMPORTANT:

  BP26 homepage logo
      -> main Zat.am homepage

  BP26 game logo
      -> BP26 contest homepage
  -------------------------------------------------
  */

  function setupBp26Logo(navbar) {
    const logo = navbar.querySelector(".zatam-logo");

    if (!logo) {
      console.warn("[BP26] Navbar logo not found.");

      return;
    }

    const onContestHome = isBp26HomePage();

    /*
    Remove normal main-site
    logo routing.
    */

    logo.removeAttribute("data-route");

    /*
    Replace original Zat.am logo
    with BP26 logo.
    */

    logo.innerHTML = `
      <img
        src="${new URL("bp26c.png", bp26Root).href}"
        alt="BP26 Sanskrit Competition"
        class="bp26-navbar-logo"
      />
    `;

    logo.classList.add("bp26-navbar-brand");

    /*
    Set destination based on page.
    */

    if (onContestHome) {
      /*
      bp26/index.html
          ->
      main Zat.am homepage
      */

      logo.href = new URL("index24.html", siteRoot).href;

      logo.title = "Go to Zat.am Home";

      logo.setAttribute("aria-label", "Go to Zat.am Home");
    } else {
      /*
      BP26 game
          ->
      BP26 homepage
      */

      logo.href = new URL("index.html", bp26Root).href;

      logo.title = "Back to Competition";

      logo.setAttribute("aria-label", "Back to BP26 Competition");
    }
  }

  /*
  -------------------------------------------------
  ACTIVE NAVIGATION
  -------------------------------------------------

  All pages inside BP26 belong to Contest.
  -------------------------------------------------
  */

  function setContestActive(navbar) {
    document.body.dataset.page = "contest";

    navbar.querySelectorAll("[data-nav-page]").forEach(function (link) {
      link.classList.toggle("active", link.dataset.navPage === "contest");
    });
  }

  /*
  -------------------------------------------------
  LEADERBOARD ORIGIN
  -------------------------------------------------

  Preserve existing BP26 behavior:
  leaderboard knows the user came from bp26.
  -------------------------------------------------
  */

  function setupBp26LeaderboardLinks(navbar) {
    const links = navbar.querySelectorAll(
      `
        [data-nav-page="leaderboard"],
        #leaderboard-link-dropdown
        `,
    );

    links.forEach(function (link) {
      if (link.tagName !== "A") {
        return;
      }

      const url = new URL(link.href, siteRoot);

      url.searchParams.set("from", "bp26");

      link.href = url.href;
    });
  }

  /*
  -------------------------------------------------
  LOAD NAVBAR AUTH
  -------------------------------------------------

  Supports both:
  - newer navbar-auth.js exporting initNavbarAuth()
  - older version that initializes automatically
  -------------------------------------------------
  */

  async function initializeNavbarAuth() {
    try {
      const navbarModule = await import(navbarAuthUrl.href);

      if (typeof navbarModule.initNavbarAuth === "function") {
        await navbarModule.initNavbarAuth();
      }
    } catch (error) {
      console.error("[BP26] Navbar auth failed:", error);
    }
  }

  /*
  -------------------------------------------------
  LOAD MAIN SHARED NAVBAR
  -------------------------------------------------
  */

  async function loadBp26Navbar() {
    const mount = document.getElementById("header-placeholder");

    if (!mount) {
      console.warn("[BP26] #header-placeholder not found.");

      return;
    }

    try {
      /*
      Give BP26 pages a common class.
      */

      document.body.classList.add("bp26-navbar-page");

      /*
      Download SAME navbar HTML
      used by the main site.
      */

      const response = await fetch(navbarHtmlUrl.href);

      if (!response.ok) {
        throw new Error(`Navbar request failed: ${response.status}`);
      }

      mount.innerHTML = await response.text();

      /*
      Main-site links.
      */

      resolveNavbarRoutes(mount);

      /*
      BP26-specific logo.
      */

      setupBp26Logo(mount);

      /*
      Contest gets active underline.
      */

      setContestActive(mount);

      /*
      Keep BP26 leaderboard return context.
      */

      setupBp26LeaderboardLinks(mount);

      /*
      Firebase / profile / streak /
      EN-SA language navbar.
      */

      await initializeNavbarAuth();

      /*
      Let other scripts know
      navbar is ready.
      */

      document.dispatchEvent(
        new CustomEvent("zatam:navbarready", {
          detail: {
            context: "bp26",
            isContestHome: isBp26HomePage(),
          },
        }),
      );

      /*
      ZIM games already calculate their
      canvas position using the header
      height. Trigger resize once after
      navbar is injected.
      */

      window.dispatchEvent(new Event("resize"));
    } catch (error) {
      console.error("[BP26] Failed to load navbar:", error);
    }
  }

  loadBp26Navbar();
})();
