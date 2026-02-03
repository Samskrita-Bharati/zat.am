import {
  checkAuth,
  logout,
  changePassword,
  updateUserProfile,
  getCurrentUserProfile,
} from "../api/auth-api.js";
import { db, doc, updateDoc } from "../api/firebase-config.js";

const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const displayRole = document.getElementById("display-role");
const displayDate = document.getElementById("display-date");
const displayLanguage = document.getElementById("display-language");
const displayLocation = document.getElementById("display-location");
const roleRow = document.getElementById("role-row");

const editNameForm = document.getElementById("edit-name-form");
const newNameInput = document.getElementById("new-name");
const languageSelect = document.getElementById("language");
const countrySelect = document.getElementById("country");
const provinceGroup = document.getElementById("province-group");
const provinceSelect = document.getElementById("province");
const otherCountryGroup = document.getElementById("other-country-group");
const otherCountryInput = document.getElementById("other-country");
const nameMessage = document.getElementById("name-message");

const logoutBtn = document.getElementById("logout-btn");
const changePasswordForm = document.getElementById("change-password-form");
const passwordMessage = document.getElementById("password-message");
const passwordCard = document.getElementById("password-card");

const countriesOptGroup = document.getElementById("all-countries");

// const languageNames = {
//   1: "Devanagari (देवनागरी)",
//   be: "Bengali (বাংলা)",
//   gu: "Gujarati (ગુજરાતી)",
//   ka: "Kannada (ಕನ್ನಡ)",
//   ml: "Malayalam (മലയാളം)",
//   te: "Telugu (తెలుగు)",
//   ta: "Tamil (தமிழ்)",
// };

const languageNames = {
  1: "Devanagari",
  be: "Bengali",
  gu: "Gujarati",
  ka: "Kannada",
  ml: "Malayalam",
  te: "Telugu",
  ta: "Tamil",
};

let currentUser = null;
let currentProfile = null;

// Load all countries
async function loadAllCountries() {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries",
    );
    if (!response.ok) throw new Error("Failed to load countries");
    const data = await response.json();

    const countries = data.data
      .map((c) => c.country)
      .filter(Boolean)
      .sort();
    countriesOptGroup.innerHTML =
      countries
        .map((country) => `<option value="${country}">${country}</option>`)
        .join("") + `<option value="other">Other</option>`;
  } catch (error) {
    console.error("Failed to load countries", error);
  }
}

// Load provinces/states
async function loadProvinces(country) {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      },
    );
    if (!response.ok) throw new Error("Failed to load regions");
    const data = await response.json();

    if (!data || !data.data || !Array.isArray(data.data.states)) {
      return [];
    }
    return data.data.states.map((state) => state.name).filter(Boolean);
  } catch (error) {
    console.error("Failed to load provinces/states", error);
    return [];
  }
}

// Country select change handler
countrySelect.addEventListener("change", async () => {
  const selected = countrySelect.value;
  provinceSelect.innerHTML = "";
  otherCountryInput.value = "";

  if (selected === "United States" || selected === "Canada") {
    provinceGroup.style.display = "block";
    otherCountryGroup.style.display = "none";

    const regions = await loadProvinces(selected);
    provinceSelect.innerHTML =
      `<option value="">Select Province / State</option>` +
      regions.map((p) => `<option value="${p}">${p}</option>`).join("");

    if (currentProfile && currentProfile.region) {
      provinceSelect.value = currentProfile.region;
    }
  } else if (selected === "other") {
    provinceGroup.style.display = "none";
    otherCountryGroup.style.display = "block";
  } else {
    provinceGroup.style.display = "none";
    otherCountryGroup.style.display = "none";
  }
});

// Load user profile
checkAuth()
  .then(async (user) => {
    currentUser = user;
    currentProfile = await getCurrentUserProfile();

    profileName.textContent = currentProfile.name || "User";
    profileEmail.textContent = user.email;

    const profileIconElement = document.querySelector(".profile-icon");
    if (user.photoURL) {
      profileIconElement.innerHTML = `<img src="${user.photoURL}" alt="Profile" class="profile-avatar-img">`;
    } else {
      profileIconElement.innerHTML = '<i class="fas fa-user-circle"></i>';
    }

    if (currentProfile.isAdmin) {
      displayRole.textContent = "Admin";
      roleRow.style.display = "flex";
    } else {
      roleRow.style.display = "none";
    }

    if (currentProfile.createdAt) {
      const date = currentProfile.createdAt.toDate();
      const options = { year: "numeric", month: "long", day: "numeric" };
      displayDate.textContent = date.toLocaleDateString("en-US", options);
    } else {
      displayDate.textContent = "Not available";
    }

    if (currentProfile.language) {
      displayLanguage.textContent =
        languageNames[currentProfile.language] || currentProfile.language;
    }

    if (currentProfile.location) {
      displayLocation.textContent = currentProfile.location;
    }

    // Load countries first
    await loadAllCountries();

    newNameInput.value = currentProfile.name || "";
    languageSelect.value = currentProfile.language || "";
    countrySelect.value = currentProfile.country || "";

    // Trigger country change to load provinces if needed
    if (
      currentProfile.country === "United States" ||
      currentProfile.country === "Canada"
    ) {
      const event = new Event("change");
      countrySelect.dispatchEvent(event);
    }

    // Check if user signed in with Google
    const isGoogleUser = user.providerData.some(
      (provider) => provider.providerId === "google.com",
    );

    if (isGoogleUser) {
      passwordCard.classList.add("disabled");
      const inputs = changePasswordForm.querySelectorAll("input");
      inputs.forEach((input) => (input.disabled = true));
      const button = changePasswordForm.querySelector("button");
      button.disabled = true;
    }
  })
  .catch(() => {
    window.location.href = "login.html";
  });

// Edit Profile Form
editNameForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newName = newNameInput.value.trim();
  const language = languageSelect.value;
  let country = countrySelect.value;
  let region = "";

  if (!newName) {
    nameMessage.innerHTML = "Name cannot be empty!";
    nameMessage.style.color = "red";
    return;
  }

  // Handle country selection
  if (country === "other") {
    const customCountry = otherCountryInput.value.trim();
    if (customCountry) {
      country = customCountry;
      region = "";
    } else {
      country = "";
    }
  } else if (country === "United States" || country === "Canada") {
    region = provinceSelect.value || "";
  }

  const location = region ? `${region}, ${country}` : country;

  try {
    await updateUserProfile(currentUser, { displayName: newName });

    const profileRef = doc(db, "users", currentUser.uid, "public", "profile");
    await updateDoc(profileRef, {
      name: newName,
      language: language || "",
      country: country || "",
      region: region || "",
      location: location || "",
    });

    // Update display
    profileName.textContent = newName;
    if (language) {
      displayLanguage.textContent = languageNames[language] || language;
    } else {
      displayLanguage.textContent = "Not set yet";
    }
    if (location) {
      displayLocation.textContent = location;
    } else {
      displayLocation.textContent = "Not set yet";
    }

    nameMessage.innerHTML = "Profile updated successfully!";
    nameMessage.style.color = "green";

    setTimeout(() => {
      nameMessage.innerHTML = "";
    }, 3000);
  } catch (error) {
    console.error(error);
    nameMessage.innerHTML = "Failed to update profile. Please try again.";
    nameMessage.style.color = "red";
  }
});

changePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-new-password").value;

  if (newPassword !== confirmPassword) {
    passwordMessage.innerHTML = "New passwords do not match!";
    passwordMessage.style.color = "red";
    return;
  }

  if (newPassword.length < 8) {
    passwordMessage.innerHTML = "New password must be at least 8 characters.";
    passwordMessage.style.color = "red";
    return;
  }

  if (currentPassword === newPassword) {
    passwordMessage.innerHTML =
      "New password must be different from current password.";
    passwordMessage.style.color = "red";
    return;
  }

  try {
    await changePassword(currentPassword, newPassword);
    passwordMessage.innerHTML = "Password changed successfully!";
    passwordMessage.style.color = "green";

    changePasswordForm.reset();

    setTimeout(() => {
      passwordMessage.innerHTML = "";
    }, 3000);
  } catch (error) {
    console.error(error);

    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      passwordMessage.innerHTML = "Current password is incorrect.";
    } else if (error.code === "auth/weak-password") {
      passwordMessage.innerHTML = "New password is too weak.";
    } else {
      passwordMessage.innerHTML =
        "Failed to change password. Please try again.";
    }

    passwordMessage.style.color = "red";
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await logout();
    window.location.href = "login.html";
  } catch (error) {
    console.error(error);
  }
});
