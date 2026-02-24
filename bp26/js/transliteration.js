(function () {
  const LANG_MAP = Object.freeze({
    1: "itrans",
    gu: "gujarati",
    ka: "kannada",
    be: "bengali",
    ml: "malayalam",
    te: "telugu",
    ta: "tamil",
    ia: "iast",
  });

  function getRawT(search) {
    const query = typeof search === "string" ? search : window.location.search;
    const value = new URLSearchParams(query).get("t");
    return value ? String(value) : null;
  }

  function getTargetScript(search) {
    const raw = getRawT(search);
    if (!raw) return null;
    return LANG_MAP[raw] || null;
  }

  function transliterate(text, from, options) {
    const source = from || "devanagari";
    const opts = options || {};
    const target = opts.target || getTargetScript(opts.search);
    const fallback = opts.fallback || null;
    const value = String(text ?? "");

    if (!window.Sanscript || typeof window.Sanscript.t !== "function") {
      return value;
    }

    try {
      if (target) return window.Sanscript.t(value, source, target);
      if (fallback) return window.Sanscript.t(value, source, fallback);
    } catch (err) {
      console.warn("[bp26 transliteration] conversion failed", err);
    }

    return value;
  }

  function numberToDevanagari(value) {
    return transliterate(String(value ?? ""), "itrans", { target: "devanagari" });
  }

  window.bp26Translit = {
    LANG_MAP,
    getRawT,
    getTargetScript,
    transliterate,
    numberToDevanagari,
  };
})();
