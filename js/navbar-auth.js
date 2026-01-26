import { auth } from "/auth/api/firebase-config.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

const loggedOut = document.getElementById("logged-out");
const loggedIn = document.getElementById("logged-in");
const profileBtn = document.getElementById("profile-btn");
const dropdown = document.getElementById("profile-dropdown");
const userEmailDropdown = document.getElementById("user-email-dropdown");
const usernameDisplay = document.getElementById("username");
const dropdownLogout = document.getElementById("dropdown-logout");

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    loggedOut.classList.add("hidden");
    loggedIn.classList.remove("hidden");

    // Display email
    userEmailDropdown.textContent = user.email;

    // display user firstname or username from email, if username not available
    let displayName;

    if (user.displayName) {
      // Get first name only
      displayName = user.displayName.split(" ")[0];
    } else {
      // Get email username before '@' symbol
      displayName = user.email.split("@")[0];
    }

    usernameDisplay.textContent = `Hi, ${displayName}!`;
  } else {
    loggedOut.classList.remove("hidden");
    loggedIn.classList.add("hidden");
  }
});

// Toggle dropdown on profile icon click
profileBtn.addEventListener("click", () => {
  dropdown.classList.toggle("hidden");
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!loggedIn.contains(e.target)) {
    dropdown.classList.add("hidden");
  }
});

// Logout
dropdownLogout.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    dropdown.classList.add("hidden");
    alert("Logged out successfully!");
  } catch (error) {
    alert("Error logging out");
    console.error(error);
  }
});
