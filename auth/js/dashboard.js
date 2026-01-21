import { checkAuth, logout } from "../api/auth-api.js";

const userEmail = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

// Check if user is logged in
checkAuth()
  .then((user) => {
    userEmail.innerHTML = `<p>You are logged in as: <strong>${user.email}</strong></p>`;
  })
  .catch(() => {
    window.location.href = "login.html";
  });

// Logout button
logoutBtn.addEventListener("click", async () => {
  try {
    await logout();
    window.location.href = "login.html";
  } catch (error) {
    console.error(error);
  }
});
