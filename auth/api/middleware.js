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

if (isProtectedGame()) {
  checkAuth()
    .then((user) => {
      console.log("User authenticated:", user.email);
    })
    .catch(() => {
      const redirectUrl = encodeURIComponent(window.location.href);

      // Get the base path from current location
      const pathParts = window.location.pathname.split("/");
      const basePath = pathParts.includes("deployment-testing")
        ? "/deployment-testing"
        : "";

      window.location.href = `${basePath}/auth/login.html?redirect=${redirectUrl}`;
    });
}

/*
  Usage: Add this line at the top of  game's index.html (right after <body> tag) to make it protected:
  <script type="module" src="./auth/api/middleware.js"></script>
*/
