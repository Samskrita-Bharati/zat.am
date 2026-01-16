// List of games that require authentication
export const protectedGames = [
  "bp26",
  "001-sbg",
  // Add more games here in the future
];

// Check if current page is a protected game
export const isProtectedGame = () => {
  const path = window.location.pathname;
  return protectedGames.some((game) => path.includes(`/${game}/`));
};
