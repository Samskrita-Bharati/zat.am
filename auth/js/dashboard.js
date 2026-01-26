import { checkAuth, logout, changePassword } from "../api/auth-api.js";

const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");
const changePasswordForm = document.getElementById("change-password-form");
const passwordMessage = document.getElementById("password-message");

// Check if user is logged in
checkAuth()
  .then((user) => {
    // Display user name (first name or email username)
    let displayName;
    if (user.displayName) {
      displayName = user.displayName.split(" ")[0];
    } else {
      displayName = user.email.split("@")[0];
    }

    userName.textContent = displayName;
    userEmail.textContent = user.email;
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

// Change password form
changePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-new-password").value;

  // Validation
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

    // Clear form
    changePasswordForm.reset();
  } catch (error) {
    console.error(error);

    if (error.code === "auth/wrong-password") {
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
