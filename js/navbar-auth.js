import {
  auth,
  onAuthStateChanged,
  signOut,
} from "../auth/api/firebase-config.js";

import { getCurrentUserProfile } from "../auth/api/auth-api.js";

import { updateStreak } from "../auth/api/streak.js";

// Prevent duplicate initialization
let navbarInitialized = false;

// =====================================================
// LANGUAGE LABELS
// =====================================================

const languageNames = {
  1: "Devanagari",
  be: "Bengali",
  gu: "Gujarati",
  ka: "Kannada",
  ml: "Malayalam",
  te: "Telugu",
  ta: "Tamil",
};

// =====================================================
// NAVBAR TRANSLATIONS
// =====================================================

const navbarTranslations = {
  en: {
    navGames: "Games",
    navAbout: "About",
    navResources: "Resources",
    navContest: "Contest",
    navLeaderboard: "Leaderboard",
    navContact: "Contact",

    login: "↪ Login",
    signup: "Sign Up",

    leaderboardDropdown: "Leaderboard",

    profile: "Profile",
    logout: "Logout",

    langButton: "🌐 EN / SA",
  },

  sa: {
    navGames: "क्रीडाः",
    navAbout: "विषये",
    navResources: "संसाधनानि",
    navContest: "स्पर्धा",
    navLeaderboard: "श्रेष्ठसूची",
    navContact: "सम्पर्कः",

    login: "↪ प्रवेशः",
    signup: "पञ्जीकरणम्",

    leaderboardDropdown: "श्रेष्ठसूची",

    profile: "परिचयः",
    logout: "निर्गमः",

    langButton: "🌐 SA / EN",
  },
};

// =====================================================
// DEFAULT PROFILE AVATAR
// =====================================================

function fallbackAvatarMarkup(large = false) {
  return `
    <span class="zatam-profile-fallback ${large ? "large" : ""}">
      👤
    </span>
  `;
}

// =====================================================
// LOCALIZED GREETING
//
// This still uses the user's preferred script.
// It is separate from EN / SA website language.
// =====================================================

function getLocalizedNamaste(langCode) {
  switch (langCode) {
    case "be":
      return "নমস্তে";

    case "gu":
      return "નમસ્તે";

    case "ka":
      return "ನಮಸ್ತೆ";

    case "ml":
      return "നമസ്തേ";

    case "te":
      return "నమస్తే";

    case "ta":
      return "நமஸ்தே";

    default:
      return "Namaste";
  }
}

// =====================================================
// MAIN INITIALIZER
// =====================================================

export async function initNavbarAuth() {
  if (navbarInitialized) {
    return;
  }

  navbarInitialized = true;

  // ===========================================
  // GET ELEMENTS AFTER NAVBAR HAS BEEN INJECTED
  // ===========================================

  const loggedOut = document.getElementById("logged-out");

  const loggedIn = document.getElementById("logged-in");

  const profileBtn = document.getElementById("profile-btn");

  const dropdown = document.getElementById("profile-dropdown");

  const userEmailDropdown = document.getElementById("user-email-dropdown");

  const usernameDisplay = document.getElementById("username");

  const streakDisplay = document.getElementById("streak");

  const userLanguageRow = document.getElementById("user-language");

  const dropdownLogout = document.getElementById("dropdown-logout");

  const headerAvatar = document.getElementById("navbar-profile-avatar");

  const dropdownAvatar = document.getElementById("dropdown-avatar");

  const headerUserName = document.getElementById("navbar-user-name");

  const langBtn = document.getElementById("zatamLangBtn");

  const loginBtn = document.getElementById("navbar-login-btn");

  const signupBtn = document.getElementById("navbar-signup-btn");

  const profileLink = document.getElementById("profile-link-dropdown");

  const leaderboardLink = document.getElementById("leaderboard-link-dropdown");

  if (!loggedOut || !loggedIn || !profileBtn || !dropdown) {
    console.error("Navbar auth elements are missing.");

    return;
  }

  // ===================================================
  // EN / SA INTERFACE LANGUAGE
  // ===================================================

  let currentLanguage = localStorage.getItem("zatamLanguage") || "en";

  function applyNavbarLanguage(emitEvent = true) {
    const t = navbarTranslations[currentLanguage] || navbarTranslations.en;

    document.querySelectorAll("[data-nav-i18n]").forEach((element) => {
      const key = element.dataset.navI18n;

      if (t[key]) {
        element.textContent = t[key];
      }
    });

    if (langBtn) {
      langBtn.textContent = t.langButton;
    }

    localStorage.setItem("zatamLanguage", currentLanguage);

    window.zatamLanguage = currentLanguage;

    if (emitEvent) {
      window.dispatchEvent(
        new CustomEvent("zatam:languagechange", {
          detail: {
            language: currentLanguage,
          },
        }),
      );
    }
  }

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      currentLanguage = currentLanguage === "en" ? "sa" : "en";

      applyNavbarLanguage();
    });
  }

  applyNavbarLanguage(false);

  // ===================================================
  // LOGIN / SIGNUP
  // ===================================================

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      if (loginBtn.dataset.href) {
        window.location.href = loginBtn.dataset.href;
      }
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      if (signupBtn.dataset.href) {
        window.location.href = signupBtn.dataset.href;
      }
    });
  }

  // ===================================================
  // PROFILE DROPDOWN
  // ===================================================

  profileBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    dropdown.classList.toggle("hidden");

    const expanded = !dropdown.classList.contains("hidden");

    profileBtn.setAttribute("aria-expanded", String(expanded));
  });

  document.addEventListener("click", (event) => {
    if (!loggedIn.contains(event.target)) {
      dropdown.classList.add("hidden");

      profileBtn.setAttribute("aria-expanded", "false");
    }
  });

  // ===================================================
  // AUTH STATE
  // ===================================================

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      loggedOut.classList.add("hidden");

      loggedIn.classList.remove("hidden");

      // ===========================================
      // NAME
      // ===========================================

      let displayName = "Player";

      if (user.displayName) {
        displayName = user.displayName.split(" ")[0];
      } else if (user.email) {
        displayName = user.email.split("@")[0];
      }

      if (headerUserName) {
        headerUserName.textContent = displayName;
      }

      if (userEmailDropdown) {
        userEmailDropdown.textContent = user.email || "";
      }

      // ===========================================
      // AVATAR
      // ===========================================

      if (headerAvatar) {
        if (user.photoURL) {
          headerAvatar.innerHTML = `
              <img
                src="${user.photoURL}"
                alt="${displayName}"
              />
            `;
        } else {
          headerAvatar.innerHTML = fallbackAvatarMarkup();
        }
      }

      if (dropdownAvatar) {
        if (user.photoURL) {
          dropdownAvatar.innerHTML = `
              <img
                src="${user.photoURL}"
                alt="${displayName}"
              />
            `;
        } else {
          dropdownAvatar.innerHTML = fallbackAvatarMarkup(true);
        }
      }

      // ===========================================
      // USER PROFILE / PREFERRED SCRIPT
      // ===========================================

      try {
        const profile = await getCurrentUserProfile();

        if (profile && profile.language) {
          window.zatPreferredLang = profile.language;

          localStorage.setItem("zatPreferredLang", profile.language);
        }

        const langCode =
          window.zatPreferredLang ||
          localStorage.getItem("zatPreferredLang") ||
          "";

        const greeting = getLocalizedNamaste(langCode);

        if (usernameDisplay) {
          usernameDisplay.textContent = `${greeting}, ${displayName}!`;
        }

        if (userLanguageRow) {
          if (langCode) {
            const languageLabel = languageNames[langCode] || langCode;

            userLanguageRow.textContent = `Language: ${languageLabel}`;

            userLanguageRow.style.display = "block";
          } else {
            userLanguageRow.textContent = "";

            userLanguageRow.style.display = "none";
          }
        }
      } catch (error) {
        console.error("Unable to load user profile:", error);

        if (usernameDisplay) {
          usernameDisplay.textContent = `Namaste, ${displayName}!`;
        }
      }

      // ===========================================
      // STREAK
      // ===========================================

      if (streakDisplay) {
        try {
          const streak = await updateStreak(user.uid);

          streakDisplay.textContent = `🔥 Streak: ${streak}`;
        } catch (error) {
          console.error("Unable to load streak:", error);

          streakDisplay.textContent = "🔥 Streak: 0";
        }
      }
    } else {
      loggedOut.classList.remove("hidden");

      loggedIn.classList.add("hidden");

      dropdown.classList.add("hidden");
    }
  });

  // ===================================================
  // LOGOUT
  // ===================================================

  if (dropdownLogout) {
    dropdownLogout.addEventListener("click", async () => {
      try {
        await signOut(auth);

        dropdown.classList.add("hidden");

        // Public main zat.am pages can simply refresh.
        window.location.reload();
      } catch (error) {
        console.error("Logout failed:", error);

        alert("Error logging out.");
      }
    });
  }

  // ===================================================
  // PROFILE ORIGIN
  // ===================================================

  if (profileLink) {
    const profileUrl = new URL(profileLink.href);

    const currentPath = window.location.pathname;

    profileUrl.searchParams.set(
      "from",
      currentPath.includes("/bp26/") ? "bp26" : "home",
    );

    profileLink.href = profileUrl.href;
  }

  // ===================================================
  // LEADERBOARD ORIGIN
  // ===================================================

  if (leaderboardLink) {
    const leaderboardUrl = new URL(leaderboardLink.href);

    const currentPath = window.location.pathname;

    leaderboardUrl.searchParams.set(
      "from",
      currentPath.includes("/bp26/") ? "bp26" : "home",
    );

    leaderboardLink.href = leaderboardUrl.href;
  }
}
