// Load header and initialize auth
(function () {
  fetch("includes/header.html")
    .then((response) => {
      if (!response.ok) throw new Error("Header not found");
      return response.text();
    })
    .then((html) => {
      document.getElementById("header-placeholder").innerHTML = html;

      // Initialize dynamic logo AFTER header is loaded
      initDynamicLogo();

      // Load navbar auth script after header is loaded
      const script = document.createElement("script");
      script.type = "module";
      script.src = "../js/navbar-auth.js";
      document.body.appendChild(script);
    })
    .catch((error) => {
      console.error("Error loading header:", error);
    });
})();

// Dynamic Logo Navigation Function
function initDynamicLogo() {
  const logo = document.querySelector(".logo");
  if (!logo) return;

  const currentPath = window.location.pathname;
  const currentFile = currentPath.split("/").pop();

  if (currentPath.includes("/bp26/")) {
    // Inside bp26 folder
    if (currentFile === "index.html" || currentFile === "") {
      // On bp26/index.html → go to home
      logo.style.cursor = "pointer";
      logo.onclick = () => {
        window.location.href = "../index24.html";
      };
      logo.setAttribute("title", "Go to Home");
    } else {
      // On any bp26 game → go back to competition
      logo.style.cursor = "pointer";
      logo.onclick = () => {
        window.location.href = "./index.html";
      };
      logo.setAttribute("title", "Back to Competition");
    }
  } else {
    logo.style.cursor = "pointer";
    logo.onclick = () => {
      window.location.href = "./index24.html";
    };
    logo.setAttribute("title", "Home");
  }
}
