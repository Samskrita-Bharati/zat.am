import {
  login,
  signInWithGoogle,
  ensureUserDocument,
} from "../api/auth-api.js";
import {
  sendEmailVerification,
  signOut,
  auth,
} from "../api/firebase-config.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("signin-email");
const passwordInput = document.getElementById("signin-password");
const message = document.getElementById("message");
const resendVerificationBtn = document.getElementById("resend-verification");

let unverifiedUser = null;

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const userCred = await login(email, password);
    const user = userCred.user;

    // Check if email is verified
    if (!user.emailVerified) {
      unverifiedUser = user;
      resendVerificationBtn.style.display = "block"; // Show resend button

      message.innerHTML =
        "Please verify your email before logging in. Check your inbox for the verification link.";
      message.style.color = "red";

      await signOut(auth);

      return;
    }

    await ensureUserDocument(user);

    // Check if preferences are set
    const { getCurrentUserProfile } = await import("../api/auth-api.js");
    const profile = await getCurrentUserProfile();

    message.innerHTML = "Login successful! Redirecting...";
    message.style.color = "green";

    setTimeout(() => {
      // Redirect to preferences if not set
      if (!profile.preferencesSet) {
        window.location.href = "preferences.html";
      } else {
        // Get redirect parameter from URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get("redirect");

        if (redirectUrl) {
          // Redirect to the original page
          window.location.href = decodeURIComponent(redirectUrl);
        } else {
          // Default redirect to main page
          window.location.href = "../index24.html";
        }
      }
    }, 1000);
  } catch (error) {
    console.error(error);
    message.innerHTML = "Invalid email or password.";
    message.style.color = "red";
  }
});

const googleSignInBtn = document.getElementById("google-signin");
googleSignInBtn.addEventListener("click", async () => {
  try {
    const cred = await signInWithGoogle();
    const isNewUser = await ensureUserDocument(cred.user);
    console.log("isNewUser:", isNewUser, "Type:", typeof isNewUser);
    message.innerHTML = "Login successful! Redirecting...";
    message.style.color = "green";

    setTimeout(() => {
      // Check if new user first - they should set preferences
      if (isNewUser === true) {
        // Default redirect to preferences page
        window.location.href = "./preferences.html";
      } else {
        // Get redirect parameter from URL for returning users
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get("redirect");
        if (redirectUrl) {
          // Redirect to the original page
          window.location.href = decodeURIComponent(redirectUrl);
        } else {
          // Default redirect to main page
          window.location.href = "../index24.html";
        }
      }
    }, 1000);
  } catch (error) {
    console.error(error);

    message.innerHTML = "Google sign-in failed. Please try again.";

    message.style.color = "red";
  }
});

// Resend verification email handler
if (resendVerificationBtn) {
  resendVerificationBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!unverifiedUser) {
      message.innerHTML = "Please try logging in first.";
      message.style.color = "red";
      return;
    }

    try {
      await sendEmailVerification(unverifiedUser);

      message.innerHTML = "Verification email sent! Please check your inbox.";
      message.style.color = "green";
    } catch (error) {
      console.error(error);

      // Handle rate limiting error
      if (error.code === "auth/too-many-requests") {
        message.innerHTML =
          "Too many requests. Please wait a few minutes and try again.";
      } else {
        message.innerHTML =
          "Failed to send verification email. Please try again.";
      }
      message.style.color = "red";
    }
  });
}
