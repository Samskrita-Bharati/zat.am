import { resetPassword } from "../api/auth-api";

const resetForm = document.getElementById("reset-form");
const emailInput = document.getElementById("reset-email");
const message = document.getElementById("errormessage");

resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
    
    const email = emailInput.value.trim();

    if (!email) {
    message.textContent = "Please enter a valid email address.";
    message.style.color = "red";
    return;
  }

    try {
    await resetPassword(email);
    message.textContent =
      "Password reset email sent! Check your inbox.";
    message.style.color = "green";
    resetForm.reset();
  } catch (error) {
    console.error(error);
   if (error.code === "auth/invalid-email") {
    message.textContent = "Please enter a valid email address.";
  } else if (error.code === "auth/user-not-found") {
    message.textContent = "No account found with this email.";
  } else {
    message.textContent = "Something went wrong. Please try again.";
  }

  message.style.color = "red";
  }

  setTimeout(() => {
      // Get redirect parameter from URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get("redirect");
      if (redirectUrl) {
        // Redirect to the original page
        window.location.href = decodeURIComponent(redirectUrl);
      } else {
        // Default redirect to login page
        window.location.href = "login.html";
      } }, 2000);
});