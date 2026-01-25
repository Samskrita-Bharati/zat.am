import { login, signInWithGoogle, ensureUserDocument } from "../api/auth-api.js";


const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("signin-email");
const passwordInput = document.getElementById("signin-password");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const userCred = await login(email, password);
    await ensureUserDocument(userCred.user);
    message.innerHTML = "Login successful! Redirecting...";
    message.style.color = "green";

    setTimeout(() => {
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
    await ensureUserDocument(cred.user);
    message.innerHTML = "Login successful! Redirecting...";
    message.style.color = "green";
    setTimeout(() => {
      // Get redirect parameter from URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get("redirect");
      if (redirectUrl) {
        // Redirect to the original page
        window.location.href = decodeURIComponent(redirectUrl);
      }}, 1000);
  } catch (error) {
    console.error(error);
    
      message.innerHTML = "Google sign-in failed. Please try again.";
    
    message.style.color = "red";
  } 
});  