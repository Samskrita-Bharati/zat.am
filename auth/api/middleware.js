import { checkAuth } from "./auth-api.js";

// List of games that require authentication
const protectedGames = [
  "bp26",
  "002-zpk",
  "014-st",
  "015-2048",
  "022-p",
  "043-trs",
  "044-gp",
  "048-fs",
  // Add more games here
];

// Check if current page is a protected
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
      window.location.href = `/auth/login.html?redirect=${redirectUrl}`;
    });
}

/*
  Usage: Add this line at the top of  game's index.html (right after <body> tag) to make it authenticated:
  <script type="module" src="/auth/api/middleware.js"></script>
*/
