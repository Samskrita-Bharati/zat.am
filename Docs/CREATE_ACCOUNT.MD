# Create Account Flow Documentation  
**Last Updated:** Feb. 09th, 2026  

---

## Purpose

The Create Account functionality allows new users to register an account for **Zat.am**.

This process includes:

- Email and Password authentication
- Firestore user profile creation
- Email verification before account access

Every new user will have a Firebase account.  
Unverified accounts are blocked from accessing the site.

---

## Key Create Account Functions

These functions are located in `auth-api.js`.  
They connect with Firebase to create the user profile and send a verification email before the account can be used.

---

## `signUp(email, password)`

Uses Firebase’s:


- Creates a user in Firebase Authentication
- Returns a `UserCredential` object

```js
export const signUp = async (email, password) => {
return await createUserWithEmailAndPassword(auth, email, password);};
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

//
}
```

### User Document Structure

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

## `updateUserProfile(user)`

- Updates the user's display name
- Stores the full name in the user profile

```js
export const updateUserProfile = async (user, data) => {
return await updateProfile(user, data);
};
```

## Creating Account Flow

The create account logic is located in `signup.js`.

## Overview

1. User enters:
   - Full Name
   - Email
   - Password
   - Confirm Password
2. User clicks the **“Create Account”** button
3. Form is submitted
4. Password is validated
5. Firebase account is created
6. Display name is set
7. Verification email is sent

---

# Password Validation

When the user submits the Create Account form:

- Password must contain **at least 8 characters**
- Password and Confirm Password fields must match

```js
if (password !== confirmPassword) {
message. innerHTML = "Passwords do not match!";
message. style. color = "red";
return;
}
if (password.length < 8) {
message. innerHTML = "Password must be at least 8 characters.";
message. style.color = "red";
return;
}
```

---

## Account Creation

Once the password is valid:

- A user account is created in Firebase Authentication
- The display name is stored in the Firebase user profile
- Firestore user documents are created (if needed)

```js
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
    } ///
```

## Email Verification

After account creation:

- Firebase sends a verification email to the user
- The email contains a verification link

```js
// Send verification email
await sendEmailverification(user);

// Sign out the user immediately
await signut(auth);

message. innerHTML =
"Account created! Please check your email to verify your account before logging in "
message.style.color = "green";
```

### Why Verification Is Required

- Ensures the email address is valid
- Confirms the user entered it correctly
- Prevents unauthorized or fake registrations

### Access Restriction

- Verification must be completed before:
  - Logging in
  - Accessing the site
  - Playing games

Unverified users are blocked until their email is verified.

---


