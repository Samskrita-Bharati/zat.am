// zat.am/loadHeader.js — auto-detect depth and load header.html
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("header");
  if (!container) return;

  const path = window.location.pathname;
  const depth = path.split("/").length - 3; // adjust for base

  const prefix = "../".repeat(depth);

  fetch(prefix + "header.html")
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;

      // inject auth logic if not already present
      if (!document.querySelector("script[src$='app.js']")) {
        const app = document.createElement("script");
        app.type = "module";
        app.src = prefix + "app.js";
        document.body.appendChild(app);
      }

      if (!document.querySelector("script[src$='navbar-auth.js']")) {
        const auth = document.createElement("script");
        auth.type = "module";
        auth.src = prefix + "js/navbar-auth.js";
        document.body.appendChild(auth);
      }

      // also re-load CSS if needed
      if (!document.querySelector("link[href$='styles.css']")) {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = prefix + "styles.css";
        document.head.appendChild(css);
      }
    })
    .catch(err => console.error("Header load failed:", err));
});
