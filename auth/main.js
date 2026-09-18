import "./style.css";
// importing Firebase Configuration
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "./firebase-config";

// Email and password for signin
const emailSignIn = document.getElementById("signin-email");
const passwordSignIn = document.getElementById("signin-password");

// Email and password for signup
const emailSignUp = document.getElementById("signup-email");
const passwordSignUp = document.getElementById("signup-password");
const nameSignUp = document.getElementById("signup-name");
const confirmPasswordSignUp = document.getElementById("signup-cpassword");

// Buttons
const signUpBtn = document.getElementById("signup-btn");
const logInBtn = document.getElementById("signin-btn");
const logOutBtn = document.getElementById("logout-btn");

// Message div
const message = document.getElementById("message");
const userEmail = document.getElementById("user-email");

// Click on Create Account Button (only if it exists)
if (signUpBtn) {
  signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(
      auth,
      emailSignUp.value,
      passwordSignUp.value
    )
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        message.innerHTML =
          "Account created successfully! Redirecting to login...";
        message.style.color = "green";
        setTimeout(() => {
          window.location.href = "login.html";
          message.innerHTML = "";
        }, 1500);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
    console.log("Create Account Button Clicked");
    console.log("Name:", nameSignUp.value);
    console.log("Email:", emailSignUp.value);
    console.log("Password:", passwordSignUp.value);
    console.log("Confirm Password:", confirmPasswordSignUp.value);
  });
}

// Click on Login Button (only if it exists)
if (logInBtn) {
  logInBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, emailSignIn.value, passwordSignIn.value)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        message.innerHTML = "Login successfully! Redirecting to dashboard...";
        message.style.color = "green";
        setTimeout(() => {
          window.location.href = "dashboard.html";
          message.innerHTML = "";
        }, 1500);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        message.innerHTML = "Invalid Credential";
        message.style.color = "red";
        setTimeout(() => {
          message.innerHTML = "";
        }, 3000);
      });
    console.log("Login Clicked");
    console.log("Email:", emailSignIn.value);
    console.log("Password:", passwordSignIn.value);
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const email = user.email;
    if (userEmail) {
      userEmail.innerHTML = `<p>You are logged in as: <strong>${email}</strong></p>`;
    }
    console.log("User signed in!");
  } else {
    // user os signed out
    if (userEmail) {
      userEmail.innerHTML = `<p>You are not logged in</p>`;
      logOutBtn.disabled = true;
      logOutBtn.style.backgroundColor = "#cccccc";
    }
    console.log("User signed out!");
  }
});

if (logOutBtn) {
  logOutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        window.location.href = "/login.html";
      })
      .catch((error) => {
        // An error happened.
      });
    console.log("Logout Clicked");
  });
}
