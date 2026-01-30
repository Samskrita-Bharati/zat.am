import { checkAuth } from "./auth-api.js";

// List of games that require authentication
const protectedGames = [
  "bp26",
  // Add more games here in the future
];

// Check if current page is a protected game
const isProtectedGame = () => {
  const path = window.location.pathname;
  return protectedGames.some((game) => path.includes(`/${game}/`));
};

// Get base path dynamically
const getBasePath = () => {
  const pathParts = window.location.pathname.split("/").filter(Boolean);

  // If localhost return empty
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    pathParts.length === 0
  ) {
    return "";
  }

  // If custom domain return empty
  if (!window.location.hostname.includes("github.io")) {
    return "";
  }

  // For GitHub Pages
  // Check if first part is a game folder - if yes, no base path
  if (protectedGames.includes(pathParts[0])) {
    return "";
  }

  // Otherwise, first part is the repo name
  return `/${pathParts[0]}`;
};

if (isProtectedGame()) {
  checkAuth()
    .then((user) => {
      console.log("User authenticated:", user.email);
    })
    .catch(() => {
      const redirectUrl = encodeURIComponent(window.location.href);
      const basePath = getBasePath();

      window.location.href = `${basePath}/auth/login.html?redirect=${redirectUrl}`;
    });
}

/*
  Usage: Add this line at the top of game's index.html (right after <body> tag) to make it protected:
  <script type="module" src="../auth/api/middleware.js"></script>
*/
