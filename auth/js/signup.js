import { signUp, updateUserProfile, ensureUserDocument } from "../api/auth-api.js";

const signupForm = document.getElementById("signup-form");
const nameInput = document.getElementById("signup-name");
const emailInput = document.getElementById("signup-email");
const passwordInput = document.getElementById("signup-password");
const confirmPasswordInput = document.getElementById("signup-cpassword");
const message = document.getElementById("message");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Validation
  if (password !== confirmPassword) {
    message.innerHTML = "Passwords do not match!";
    message.style.color = "red";
    return;
  }

  if (password.length < 8) {
    message.innerHTML = "Password must be at least 8 characters.";
    message.style.color = "red";
    return;
  }

  try {
    // Create account
    const userCred = await signUp(email, password);
    const user = userCred.user;

    // Update user profile with display name
    await updateUserProfile(user, {
      displayName: name,
    });

    // Create Firestore user document with default isAdmin = false
    await ensureUserDocument(user, { name });

    message.innerHTML = "Account created! Redirecting to login...";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } catch (error) {
    console.error(error);
    message.innerHTML = error.message;
    message.style.color = "red";
  }
});
