import {
  signUp,
  updateUserProfile,
  ensureUserDocument,
} from "../api/auth-api.js";
import {
  sendEmailVerification,
  signOut,
  auth,
} from "../api/firebase-config.js";

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

    // Send verification email
    await sendEmailVerification(user);

    // Sign out the user immediately
    await signOut(auth);

    message.innerHTML =
      "Account created! Please check your email to verify your account before logging in.";
    message.style.color = "green";

    setTimeout(() => {
      // window.location.href = "preferences.html"; // Redirect to preferences page
      window.location.href = "login.html";
    }, 4000);
  } catch (error) {
    console.error(error);

    // Handle error
    if (error.code === "auth/too-many-requests") {
      message.innerHTML =
        "Too many signup attempts. Please try again in a few minutes.";
    } else {
      message.innerHTML = error.message;
    }
    message.style.color = "red";
  }
});
