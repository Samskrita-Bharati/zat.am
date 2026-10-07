

# ZAT.am — Firebase Integration Guide

**Author:** Imen Brahem
**Last Updated:** February 2026

---

# 1. Introduction

ZAT.am is a multilingual learning platform that uses Firebase to securely manage user authentication, profile data, preferences, and leaderboard history. Firebase was chosen because it provides a lightweight, serverless backend that integrates smoothly with static hosting (GitHub Pages), ensuring fast performance and minimal maintenance.

Firebase powers four core functions in ZAT.am:

1. Authentication — Email/Password and Google Sign-In
2. User Profiles — Storing name, language, country, region
3. Protected Game Access — Restricting certain pages to logged-in users
4. Leaderboard System — Recording monthly game scores for competitions

This guide explains how Firebase is set up, how data flows through ZAT.am, and where each part of the logic is implemented.

---

# 2. Firebase Configuration & Initialization

Firebase is imported using lightweight CDN modules. Initialization happens once inside:

```
auth/api/firebase-config.js
```

## Code Snippet — firebase-config.js

```javascript
// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
```

### Purpose

This file provides the global `auth` and `db` instances used throughout the project.

---

### Firebase Console → Project Settings

Paste your screenshot below:

```
[Insert Firebase Project Settings Screenshot Here]![](image.png)
```
![alt text](image-1.png)
---

# 3. Authentication (Login, Signup, Google Sign-In)

All sign-in and sign-up operations are handled inside:

```
auth/api/auth-api.js
```

## Code Snippet — auth-api.js

```javascript
// auth-api.js
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged 
} from "firebase-auth.js";

import { auth, db } from "./firebase-config.js";

export function checkAuth() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, user => user ? resolve(user) : reject());
  });
}
```

### What this file does

* Creates new accounts
* Logs users in
* Detects when a user is authenticated
* Supports Google OAuth

---

### Firebase Console → Authentication → Users

```
```
![alt text](image-3.png)
---

# 4. Storing User Profiles in Firestore

Once a user logs in or creates an account, ZAT.am stores their preferences (name, language, country, region).

Profile storage logic is located in:

* `auth/profile.js`
* `auth/api/auth-api.js`

---

## Code Snippet — Updating Firestore Profile

```javascript
// profile.js (excerpt)
import { doc, updateDoc } from "../api/firebase-config.js";

const profileRef = doc(
  db, "users", currentUser.uid, "public", "profile"
);

await updateDoc(profileRef, {
  name: newName,
  language,
  country,
  region,
  location,
  preferencesSet: true
});
```

---

## Firestore Structure Used in ZAT.am

```
users/
   {uid}/
      public/
         profile
```

---

### Firebase Console → Firestore → users collection

```
[Insert Firestore Users Screenshot Here]
```
![alt text](image-4.png)
---

# 5. Redirecting Users to the Preferences Page (First Login Flow)

When someone logs in for the first time, ZAT.am automatically redirects them to `preferences.html` to collect:

* Chosen second language
* Country
* Province/State (if Canada/USA)

This ensures all games can use bilingual mode and dynamic content.

---

## Code Snippet — middleware.js

```javascript
// middleware.js
if (isProtectedGame()) {
  checkAuth().catch(() => {
    const redirect = encodeURIComponent(window.location.href);
    window.location.href = `/auth/login.html?redirect=${redirect}`;
  });
}
```

### Use

Ensures only authenticated users access protected game pages like `/bp26/`.

---

# 6. Profile Page — Reading Firestore Data

The profile dashboard retrieves stored values (name, language, country) and updates the UI automatically.

## Code Snippet — profile.js (reading values)

```javascript
// profile.js (excerpt)
currentProfile = await getCurrentUserProfile();

profileName.textContent = currentProfile.name;
displayLanguage.textContent = languageNames[currentProfile.language];
displayLocation.textContent = currentProfile.location;
```

---

# 7. Bilingual Mode (Local Logic Using Firebase Language)

Although bilingual mode is not stored in Firestore, it relies on the preferred language retrieved from Firebase.

Once loaded, the language is cached locally:

```javascript
localStorage.setItem("zatPreferredLang", profile.language);
```

A toggle in the navbar allows users to turn bilingual mode on or off. Supported pages append a query parameter to enable script conversion.

---

# 8. Leaderboards & Game History (bp26 Competition)

ZAT.am tracks competition results in a structured leaderboard stored in Firestore.

---

## Firestore Hierarchy

```
leaderboards/
   Global/
      gameHistory/
         YYYY-MM/
            entries: {
              userId_timestamp_key: score
            }
```

---

## Code Snippet — Writing Leaderboard Results

```javascript
// bp26/score-submit.js
await setDoc(doc(db, "leaderboards", gameName, "gameHistory", month), {
  entries: updatedEntries
}, { merge: true });
```

Scores are grouped by game and by month, allowing long-term performance tracking.

---

### Leaderboards → Global

```

```
![alt text](image-5.png)
---

### Game Monthly History (2026-02 Example)

```
leaderboards → bp26 → gameHistory → 2026-02
```

```
[Insert Leaderboard Monthly Screenshot Here]
```
![alt text](image-6.png)
---

# 9. Architecture & Database Flow

```
ZAT.am Website (index24 + public games)
│
▼
Public Games (no authentication required)

User selects a bp26 (protected) game
│
▼
/bp26/* → checkAuth()

Is user authenticated?
├─ Yes → Load bp26 game + show Profile icon
└─ No  → Redirect to /auth/login.html?redirect=...

Login Page (Email/Password or Google)
│
▼
On first login → redirect to /preferences.html

Preferences Page:
• Preferred script/language
• Country
• Province/State
→ Saved to Firestore under users/{uid}/public/profile

Profile Complete:
• Navbar profile icon visible
• Bilingual toggle uses stored language

User returns to bp26 game:
• Game loads with Firestore profile data
• Leaderboard writes to:
  leaderboards/{game}/gameHistory/YYYY-MM
```

---

# 10. Files in the Project That Use Firebase

| File Name                   | Purpose                                  | Firebase Features Used |
| --------------------------- | ---------------------------------------- | ---------------------- |
| auth/api/firebase-config.js | Global Firebase initialization           | Auth + Firestore       |
| auth/api/auth-api.js        | Login, signup, Google sign-in, checkAuth | Auth                   |
| auth/middleware.js          | Redirect users if not logged in          | Auth state             |
| auth/profile.js             | Update profile, read Firestore           | Firestore              |
| js/navbar-auth.js           | Navbar UI based on auth state            | Auth                   |
| preferences.js              | Saves country/language to Firestore      | Firestore              |

---

# 11. Summary

Firebase enables ZAT.am to operate as a secure multilingual platform with:

* Reliable authentication
* Persistent user profiles
* Required onboarding via preferences
* Protected access to competition games
* A scalable leaderboard system

The integration is intentionally modular, making future expansions such as analytics, progress history, or achievements easy to implement.

This document provides a complete overview of how Firebase supports ZAT.am across authentication, gameplay, and user experience.

---


