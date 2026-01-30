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

const editNameForm = document.getElementById("edit-name-form");
const newNameInput = document.getElementById("new-name");
const nameMessage = document.getElementById("name-message");

const logoutBtn = document.getElementById("logout-btn");
const changePasswordForm = document.getElementById("change-password-form");
const passwordMessage = document.getElementById("password-message");
const passwordCard = document.getElementById("password-card");

let currentUser = null;

checkAuth()
  .then(async (user) => {
    currentUser = user;
    const profile = await getCurrentUserProfile();

    profileName.textContent = profile.name || "User";
    profileEmail.textContent = user.email;

    if (profile.isAdmin) {
      displayRole.textContent = "Admin";
    } else {
      displayRole.textContent = "User";
    }

    if (profile.createdAt) {
      const date = profile.createdAt.toDate();
      const options = { year: "numeric", month: "long", day: "numeric" };
      displayDate.textContent = date.toLocaleDateString("en-US", options);
    } else {
      displayDate.textContent = "Not available";
    }

    newNameInput.value = profile.name || "";

    // Check if user signed in with Google
    const isGoogleUser = user.providerData.some(
      (provider) => provider.providerId === "google.com",
    );

    if (isGoogleUser) {
      // Disable password change section for Google users
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

editNameForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newName = newNameInput.value.trim();

  if (!newName) {
    nameMessage.innerHTML = "Name cannot be empty!";
    nameMessage.style.color = "red";
    return;
  }

  try {
    await updateUserProfile(currentUser, { displayName: newName });

    const profileRef = doc(db, "users", currentUser.uid, "public", "profile");
    await updateDoc(profileRef, { name: newName });

    profileName.textContent = newName;

    nameMessage.innerHTML = "Name updated successfully!";
    nameMessage.style.color = "green";

    setTimeout(() => {
      nameMessage.innerHTML = "";
    }, 3000);
  } catch (error) {
    console.error(error);
    nameMessage.innerHTML = "Failed to update name. Please try again.";
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
