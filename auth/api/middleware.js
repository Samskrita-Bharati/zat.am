import { checkAuth } from "./auth-api.js";
import { isProtectedGame } from "./protected-games.js";

if (isProtectedGame()) {
  checkAuth()
    .then((user) => {
      console.log("User authenticated:", user.email);
      // Allow access to game
    })
    .catch(() => {
      // Get current URL
      const redirectUrl = encodeURIComponent(window.location.href);

      // Redirect to login with redirect parameter
      window.location.href = `/auth/login.html?redirect=${redirectUrl}`;
      console.log("not logged in");
    });
}
