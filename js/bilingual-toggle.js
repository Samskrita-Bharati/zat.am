// Lightweight bilingual mode toggle for game pages (e.g., bp26)
// Adds a floating button that toggles the `t` query param based on
// the user's stored preferred language in localStorage.

function initBilingualToggle() {
  try {
    var preferred = localStorage.getItem("zatPreferredLang") || "";
    var params = new URLSearchParams(window.location.search);
    var currentT = params.get("t");

    // Global bilingual toggle from navbar-auth (or persisted flag).
    var globalOn =
      (typeof window !== "undefined" && window.zatBilingualOn === true) ||
      localStorage.getItem("zatBilingualOn") === "1";

    // Normalize legacy `t=1` (generic "on") to the user's
    // preferred language code, if we have one.
    if (currentT === "1" && preferred && preferred !== "1") {
      params.set("t", preferred);
      var newQueryNorm = params.toString();
      var newUrlNorm =
        window.location.pathname + (newQueryNorm ? "?" + newQueryNorm : "");

      // Use replace() so the back button doesn't go through the
      // intermediate legacy `t=1` URL.
      window.location.replace(newUrlNorm);
      return;
    }

    // If global bilingual is ON but this page URL doesn't yet have
    // a `t` parameter, automatically add the user's preferred
    // language code so games like fw.html, ma.html, fnd.html pick it up.
    if (!currentT && globalOn && preferred) {
      params.set("t", preferred);
      var newQueryAuto = params.toString();
      var newUrlAuto =
        window.location.pathname + (newQueryAuto ? "?" + newQueryAuto : "");
      window.location.replace(newUrlAuto);
      return;
    }

    var hasT = params.get("t");

    var btn = document.createElement("button");
    btn.id = "zat-bilingual-game-toggle";
    btn.textContent = hasT ? "Bilingual: On" : "Bilingual: Off";
    // Match main header button styling as much as possible
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = "9999";
    btn.style.padding = "0.375rem 0.75rem";
    btn.style.borderRadius = "0.5rem";
    btn.style.border = "2px solid #c59d5f"; // var(--clr-gold)
    btn.style.backgroundColor = "rgba(255,255,255,0.95)";
    btn.style.color = "#c59d5f";
    btn.style.fontSize = "0.95rem";
    btn.style.letterSpacing = "1px";
    btn.style.textTransform = "capitalize";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
    btn.style.transition = "all 0.3s linear";

    btn.addEventListener("mouseenter", function () {
      btn.style.backgroundColor = "#c59d5f";
      btn.style.color = "#fff";
    });

    btn.addEventListener("mouseleave", function () {
      btn.style.backgroundColor = "rgba(255,255,255,0.95)";
      btn.style.color = "#c59d5f";
    });

    btn.addEventListener("click", function () {
      var currentParams = new URLSearchParams(window.location.search);
      var currentT = currentParams.get("t");

      if (currentT) {
        // Turn bilingual mode off globally and for this page:
        // update persisted flag so auto-add logic won't re-enable it.
        try {
          localStorage.setItem("zatBilingualOn", "0");
          if (typeof window !== "undefined") {
            window.zatBilingualOn = false;
            if (typeof window.zatRefreshMenu === "function") {
              window.zatRefreshMenu();
            }
          }
        } catch (e) {
          console.warn("Failed to persist bilingual OFF state", e);
        }
        // Remove `t` and reload
        currentParams.delete("t");
      } else {
        if (!preferred) {
          alert(
            "Please set your preferred language in the Preferences page first.",
          );
          return;
        }
        // Turn bilingual mode on globally and for this page
        try {
          localStorage.setItem("zatBilingualOn", "1");
          if (typeof window !== "undefined") {
            window.zatBilingualOn = true;
            if (typeof window.zatRefreshMenu === "function") {
              window.zatRefreshMenu();
            }
          }
        } catch (e) {
          console.warn("Failed to persist bilingual ON state", e);
        }
        currentParams.set("t", preferred);
      }

      var newQuery = currentParams.toString();
      var newUrl = window.location.pathname + (newQuery ? "?" + newQuery : "");
      window.location.href = newUrl;
    });

    document.body.appendChild(btn);
  } catch (e) {
    // Fail silently; games should still work even if this script fails.
    console.error("bilingual-toggle init failed", e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBilingualToggle);
} else {
  initBilingualToggle();
}
