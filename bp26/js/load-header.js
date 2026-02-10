// Load header and initialize auth
(function () {
  fetch("includes/header.html")
    .then((response) => {
      if (!response.ok) throw new Error("Header not found");
      return response.text();
    })
    .then((html) => {
      document.getElementById("header-placeholder").innerHTML = html;

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
