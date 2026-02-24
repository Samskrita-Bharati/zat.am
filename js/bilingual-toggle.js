// Lightweight bilingual mode helper for game pages (e.g., bp26)
// Handles URL `t` query param based on the user's stored
// preferred language and the shared global bilingual flag.

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

    // Expose a helper so the navbar bilingual button can
    // keep this page's `t` parameter in sync with the
    // global bilingual flag and preferred language.
    if (typeof window !== "undefined") {
      window.zatSyncBilingualQueryParam = function () {
        try {
          var preferredLang =
            window.zatPreferredLang ||
            localStorage.getItem("zatPreferredLang") ||
            "";
          var currentParams = new URLSearchParams(window.location.search);
          var existingT = currentParams.get("t");

          if (window.zatBilingualOn === true && preferredLang) {
            if (existingT !== preferredLang) {
              currentParams.set("t", preferredLang);
            }
          } else if (existingT) {
            currentParams.delete("t");
          }

          var newQuery = currentParams.toString();
          var newUrl =
            window.location.pathname + (newQuery ? "?" + newQuery : "");
          var currentUrl = window.location.pathname + window.location.search;

          if (newUrl !== currentUrl) {
            window.location.href = newUrl;
          }
        } catch (err) {
          console.error("zatSyncBilingualQueryParam failed", err);
        }
      };
    }
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
