import {
  auth,
  onAuthStateChanged,
  signOut,
} from "../auth/api/firebase-config.js";
import { getCurrentUserProfile } from "../auth/api/auth-api.js";
import { updateStreak } from "../auth/api/streak.js";

const loggedOut = document.getElementById("logged-out");
const loggedIn = document.getElementById("logged-in");
const profileBtn = document.getElementById("profile-btn");
const dropdown = document.getElementById("profile-dropdown");
const userEmailDropdown = document.getElementById("user-email-dropdown");
const usernameDisplay = document.getElementById("username");
const streakDisplay = document.getElementById("streak");
const userLanguageRow = document.getElementById("user-language");
const dropdownLogout = document.getElementById("dropdown-logout");
const bilingualBtn = document.getElementById("bilingual-toggle");

// Match the human-readable language names used on the profile page
const languageNames = {
  1: "Devanagari",
  be: "Bengali",
  gu: "Gujarati",
  ka: "Kannada",
  ml: "Malayalam",
  te: "Telugu",
  ta: "Tamil",
};

// Initialize shared bilingual state from localStorage
const storedBilingual = localStorage.getItem("zatBilingualOn");
window.zatBilingualOn = storedBilingual === "1";

const storedLang = localStorage.getItem("zatPreferredLang");
if (storedLang) {
  window.zatPreferredLang = storedLang;
}

const updateBilingualButton = () => {
  if (!bilingualBtn) return;
  const on = window.zatBilingualOn === true;
  bilingualBtn.textContent = on ? "Bilingual: On" : "Bilingual: Off";
};

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
  const authBtn = document.querySelector(".auth-btn");
  if (authBtn) {
    authBtn.style.visibility = "visible";
  }

  if (user) {
    loggedOut.classList.add("hidden");
    loggedIn.classList.remove("hidden");

    // Show bilingual toggle only for logged-in users
    if (bilingualBtn) {
      bilingualBtn.classList.remove("hidden");
      bilingualBtn.style.display = "";
    }

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

    // Load user profile to get preferred language code
    // Helper: map preferred language code to a localized "Namaste"
    const getLocalizedNamaste = (langCode) => {
      switch (langCode) {
        case "be":
          return "নমস্তে"; // Bengali
        case "gu":
          return "નમસ્તે"; // Gujarati
        case "ka":
          return "ನಮಸ್ತೆ"; // Kannada
        case "ml":
          return "നമസ്തേ"; // Malayalam
        case "te":
          return "నమస్తే"; // Telugu
        case "ta":
          return "நமஸ்தே"; // Tamil
        default:
          return "Namaste";
      }
    };

    // Google Profile image
    if (user.photoURL) {
      profileBtn.innerHTML = `<img src="${user.photoURL}" alt="Profile" class="profile-image">`;
    } else {
      profileBtn.innerHTML =
        '<i class="fas fa-user-circle fa-2x profile-icon"></i>';
    }

    const dropdownIconSpan = dropdown.querySelector(".dropdown-header > span");
    if (dropdownIconSpan) {
      if (user.photoURL) {
        dropdownIconSpan.innerHTML = `<img src="${user.photoURL}" alt="Profile" class="dropdown-profile-image">`;
      } else {
        dropdownIconSpan.innerHTML =
          '<i class="fas fa-user-circle fa-3x profile-icon"></i>';
      }
    }

    // Load user profile to get preferred language code and update UI
    getCurrentUserProfile()
      .then((profile) => {
        if (profile && profile.language) {
          window.zatPreferredLang = profile.language;
          localStorage.setItem("zatPreferredLang", profile.language);
        }

        const langCode = window.zatPreferredLang || "";
        const greetingWord = getLocalizedNamaste(langCode);
        usernameDisplay.textContent = `${greetingWord}, ${displayName}!`;

        if (userLanguageRow) {
          if (langCode) {
            const langLabel = languageNames[langCode] || langCode;
            userLanguageRow.textContent = `Language: ${langLabel}`;
            userLanguageRow.style.display = "block";
          } else {
            userLanguageRow.textContent = "";
            userLanguageRow.style.display = "none";
          }
        }

        updateBilingualButton();
      })
      .catch(() => {
        const langCode = window.zatPreferredLang || "";
        const greetingWord = getLocalizedNamaste(langCode);
        usernameDisplay.textContent = `${greetingWord}, ${displayName}!`;

        if (userLanguageRow) {
          if (langCode) {
            const langLabel = languageNames[langCode] || langCode;
            userLanguageRow.textContent = `Language: ${langLabel}`;
            userLanguageRow.style.display = "block";
          } else {
            userLanguageRow.textContent = "";
            userLanguageRow.style.display = "none";
          }
        }

        updateBilingualButton();
      });

    const streak = await updateStreak(user.uid);
    streakDisplay.textContent = `🔥 Streak: ${streak}`;
  } else {
    loggedOut.classList.remove("hidden");
    loggedIn.classList.add("hidden");

    // Hide bilingual toggle for logged-out users
    if (bilingualBtn) {
      bilingualBtn.classList.add("hidden");
      bilingualBtn.style.display = "none";
    }

    updateBilingualButton();
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
if (dropdownLogout) {
  dropdownLogout.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      dropdown.classList.add("hidden");

      // Check if we're on a protected page
      const currentPath = window.location.pathname;
      if (currentPath.includes("/bp26/")) {
        // Redirect to login instead of showing alert
        window.location.href = "../auth/login.html";
      } else {
        // On public pages, just show confirmation
        alert("Logged out successfully!");
        // Optionally reload to update UI
        window.location.reload();
      }
    } catch (error) {
      alert("Error logging out");
      console.error(error);
    }
  });
}

// Bilingual mode toggle handler
if (bilingualBtn) {
  updateBilingualButton();

  bilingualBtn.addEventListener("click", () => {
    const preferredLang =
      window.zatPreferredLang || localStorage.getItem("zatPreferredLang") || "";

    const turningOn = !window.zatBilingualOn;

    // Require a preferred language before turning bilingual mode ON
    if (turningOn && !preferredLang) {
      alert(
        "Please set your preferred language in the Preferences page first.",
      );
      return;
    }

    window.zatBilingualOn = turningOn;
    localStorage.setItem("zatBilingualOn", turningOn ? "1" : "0");
    updateBilingualButton();

    // If the main menu is present, refresh it so links (like bp26)
    // immediately pick up the new bilingual state.
    if (typeof window.zatRefreshMenu === "function") {
      window.zatRefreshMenu();
    }

    // On pages that support bilingual query-param behavior
    // (e.g., competition/game pages that load bilingual-toggle.js),
    // sync the current page URL's `t` parameter with the new state.
    if (typeof window.zatSyncBilingualQueryParam === "function") {
      window.zatSyncBilingualQueryParam();
    }
  });
}

// Set profile link with origin parameter
const profileLinkDropdown = document.getElementById("profile-link-dropdown");
if (profileLinkDropdown) {
  profileLinkDropdown.addEventListener("click", (e) => {
    e.preventDefault();
    const currentPath = window.location.pathname;
    const origin = currentPath.includes("/bp26/") ? "bp26" : "home";
    window.location.href = `../auth/profile.html?from=${origin}`;
  });
}
