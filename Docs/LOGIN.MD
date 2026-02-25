# Zat.am Login Flow Document  
**Last Updated:** Feb. 9th, 2026  

---

## Purpose

The login system is designed to:

- Authenticate users using **Email and Password** or through **Google OAuth**
- Check email verification for email sign-up
- Create the Firestore user profile documents
- Redirect users based on their profile (preferences) completion

This ensures that a user has a valid account before gaining access to protected files.

Both **Email & Password sign-in** and **Google OAuth** create a document in the same Firestore database. Each document contains the same structure.

---

## Key Authentication Functions

These authentication functions are located in `auth-api.js`.  
They connect with Firebase to complete authentication.

---

## `login(email, password)`

Uses: `signInWithEmailAndPassword(auth, email, password)`
from Firebase Authentication to verify the provided credentials for the given auth instance.
Returns: `UserCredential` object

```js
export const login = async(email, password) => {
    return await singInWithEmailAndPassword(auth,email,password);
};
```

## `signInWithGoogle()`

Uses:
- Opens a Google sign-in popup
- User completes sign-in
- The returned `UserCredential` object is saved in the variable `cred`

```js
export const signInWithGoogle = async () => {
const cred = await signInWithPopup(auth, googleProvider);
return cred;
};
```

## `ensureUserDocument()`

Checks whether the user document exists in Firestore.

```js

export const ensureUserDocument = async (user, extraData = {}) => {
if (!user) return;
const accountRef = doc(db, "users", user.uid, "private", "account");
const profileRef = doc(db, "users", user.uid, "public", "profile");

const [accountSnap, profileSnap] = await Promise.all([
getDoc(accountRef),
getDoc(profileRef),
]);

...............
}
```

## User Document Structure

Each user document contains:

- **Private fields**
- **Public fields**

If the user is new or missing any document:

- Documents are created with default values
- `admin` defaults to `false`
- Admin status can only be changed directly in Firebase

```js
const isNewUser = !accountSnap. exists() && ! profileSnap. exists();

if (!accountSnap.exists()) {
await setDoc(accountRef, {
email: email || "",
isAdmin: false,
createdAt: serverTimestamp(),
});
}

if (!profileSnap.exists()) {
await setDoc(profileRef, {
name: displayName || safeExtraData.name || "",
language: safeExtraData.language || "1", // Default language
country: safeExtraData.country || "",
region: safeExtraData.region || "",
location: safeExtraData.location || "",
preferencesSet: false, // Default preferences set to False
createdAt: serverTimestamp(),
});
}
return isNewUser;
```

## Email Login Flow

The login functionality is contained in `login.js`.

---

## Overview

1. User enters email and password
2. Clicks the **"Sign In"** button
3. Form is submitted
4. Credentials are checked in Firebase Authentication
5. Email verification is checked
6. User document is verified/created
7. User is redirected based on status

---

## Email Verification Check

- Unverified users are blocked from entering the application
- A **Resend Verification Link** appears
- User is signed out until email is verified

```js 
// Check if email is verified
if (!user.emailVerified) {
unverifiedUser = user;
resendVerificationBtn.style.display = "block";
  //***********//
 await signOut(auth); 
 return 
}
 ```

### Resend Verification Link

The resend link only appears if:
- The user attempts to sign in with an **unverified email address**

```html 
<p>
<a href="#" id="resend-verification" style="display: none"
| >Resend Verification Email</a

>
</p>
```

## Google Sign-In Flow

Signing in with Google allows users to create an account and log in using their Google account.

1. User signs in through popup
2. Firestore documents are created (if needed)
3. User is redirected based on profile status

```js
const googlesignInBtn = document.getElementById("google-signin");
googleSignInBtn.addEventListener("click", async () => {
try {
const cred = await signInwithGoogle();
const isNewUser = await ensureUserDocument(cred.user);
//
}
//
});

```

## Redirect Logic After Login

For both **Google Sign-In** and **Email & Password Sign-In**:

1. The system checks Firestore for the user's documents
2. If the user is new:
   - Preferences are incomplete by default
   - Redirected to: `preferences.html`
3. If the user is returning:
   - Redirected to: `index24.html`

```js
await ensureUserDocument (user);
// Check if preferences are set
const { getCurrentUserProfile } = await import(" .. /api/auth-api.js");
const profile = await getCurrentUserProfile();
//
if (!profile.preferencesSet) {
window.location.href = "preferences.html";
}
else {
// Default redirect to main page
window. location.href = " .. /index24.html";}
//

```


