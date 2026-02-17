# Admin Status and Firestore Integration

This document explains how **admin status** is modeled, enforced, and used in the `zat.am` project. It is intended for:

- The **auth/frontend team** (how admin status is created, stored, and read).
- The **leaderboard team** (how to check admin status and rely on Firestore rules).

---

## 1. Data Model

### 1.1 Firestore `users` Collection

Each authenticated user has a corresponding document in the `users` collection:

- Collection: `users`
- Document ID: `uid` (Firebase Auth user ID)
- Fields:
  - `email` (string) – user email
  - `name` (string) – display name
  - `isAdmin` (boolean) – admin flag (default `false`)
  - `createdAt` (timestamp) – server timestamp when the profile is created

Example document structure:

```json
{
  "email": "user@example.com",
  "name": "User Name",
  "isAdmin": false,
  "createdAt": {".sv": "timestamp"}
}
```

> **Important:** `isAdmin` is **never** set or updated from arbitrary client input. It is only:
> - Initially created as `false` by the client.
> - Changed to `true` or back to `false` via trusted mechanisms (e.g., Firestore console, Admin SDK, or a secure admin-only UI that respects the rules).

---

## 2. Firestore Security Rules

Firestore rules are defined in `firestore.rules` at the project root.

Key behaviors:

### 2.1 Users Collection Rules

- **Read own document**
  - `allow read: if request.auth.uid == userId;`

- **Create own document**
  - `allow create: if request.auth.uid == userId;`

- **Update own document, but cannot change `isAdmin`**
  - Users can update their profile, **except** for `isAdmin`:
  - If the request tries to change `isAdmin` when updating their own document, the write is denied.

- **Admins can update only `isAdmin` for other users**
  - If `request.auth.uid != userId` and the caller is an admin (`isAdmin == true` in their own user document), they can change **only** the `isAdmin` field on other user documents.
  - Rules enforce that the diff of changed keys is exactly `['isAdmin']`.

- **Deletes are denied**
  - `allow delete: if false;` – user documents cannot be deleted via client.

### 2.2 Leaderboards (for leaderboard team)

Rules for leaderboards are present but currently commented out as a TODO. When enabled:

- Leaderboard documents are under: `leaderboards/{gameId}/{leaderboardType}/scores/{userId}`.
- Public read: Anyone can read leaderboard scores.
- Writes:
  - `allow create, update: if request.auth.uid == userId;` – users can write only their own scores.
- Deletes / resets:
  - `allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;` – only admins can delete/reset scores.

The leaderboard team can uncomment and adjust this block when implementing leaderboards.

### 2.3 Admin Logs (future)

- `admin-logs/{document}` can only be **read** by admins; no writes allowed currently.

### 2.4 Catch-All

- Any other document paths default to **deny all** (`allow read, write: if false;`).

---

## 3. Frontend Firebase Setup

### 3.1 Environment Variables

Firebase config is driven by Vite environment variables defined in `.env`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

These are consumed in `auth/api/firebase-config.js` to initialize Firebase:

- `initializeApp(firebaseConfig)`
- `getAuth(app)` – for authentication
- `getFirestore(app)` – for Firestore

Exports:

- `auth`, `db`
- Auth helpers: `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, etc.

---

## 4. Auth Flow and User Document Creation

All auth paths ensure a corresponding Firestore `users/{uid}` document exists.

### 4.1 Helper: `ensureUserDocument(user, extraData?)`

Defined in `auth/api/auth-api.js`.

Behavior:

- If `user` is falsy ⇒ no-op.
- Looks up `users/{user.uid}`.
  - If the document **exists** ⇒ returns without modifying anything.
  - If it **does not exist** ⇒ creates it with:
    - `email` from `user.email` (or empty string)
    - `name` from `user.displayName` or `extraData.name` (or empty string)
    - `isAdmin: false`
    - `createdAt: serverTimestamp()`
    - Any other safe fields from `extraData`, **excluding** `isAdmin`.

> This function intentionally **never** changes `isAdmin` on existing documents.

### 4.2 Signup Flow

File: `auth/js/signup.js`

- `signUp(email, password)` creates a Firebase Auth user.
- `updateUserProfile(user, { displayName: name })` stores name in the auth profile.
- `ensureUserDocument(user, { name })` then creates the Firestore profile if missing.

Result:

- New users always get a `users/{uid}` document with `isAdmin: false` and `createdAt` set.

### 4.3 Email/Password Login Flow

File: `auth/js/login.js`

- `login(email, password)` signs the user in and returns a credential.
- `ensureUserDocument(userCred.user)` is called:
  - Useful for older users who existed before this profile setup.
  - If the profile document is missing, it is created.

### 4.4 Google Sign-In Flow

File: `auth/js/login.js` and `auth/api/auth-api.js`

- `signInWithGoogle()` (in `auth-api.js`) does:
  - `signInWithPopup(auth, googleProvider)`
  - `ensureUserDocument(cred.user)`
  - Returns the credential.

- `login.js` also calls `ensureUserDocument(cred.user)` after the call, but `ensureUserDocument` is idempotent; if the doc already exists, nothing changes.

Result:

- Google-only users also get consistent user documents in `users`.

---

## 5. Helper Functions for Teams

All helpers are in `auth/api/auth-api.js`.

### 5.1 `ensureUserDocument(user, extraData?)`

- **Purpose:** Guarantee a `users/{uid}` profile exists without ever changing `isAdmin`.
- **Usage:** Already wired into signup and login flows; you usually don’t need to call this manually.

Example (if needed):

```js
import { ensureUserDocument, getCurrentUser } from "/auth/api/auth-api.js";

const user = getCurrentUser();
await ensureUserDocument(user, { name: "Optional Name Override" });
```

### 5.2 `getCurrentUserProfile()`

- **Purpose:** Fetch the current logged-in user’s Firestore profile document.
- **Returns:**
  - `null` if no user is logged in or the profile doc doesn’t exist.
  - Otherwise: `{ id, email, name, isAdmin, createdAt, ... }`.

Example:

```js
import { getCurrentUserProfile } from "/auth/api/auth-api.js";

const profile = await getCurrentUserProfile();
if (profile) {
  console.log("User name:", profile.name);
  console.log("Is admin:", profile.isAdmin);
}
```

### 5.3 `isCurrentUserAdmin()`

- **Purpose (main one for leaderboard team):** Quickly check whether the logged-in user is an admin.
- **Returns:**
  - `true` if `profile.isAdmin === true`.
  - `false` otherwise or if there is no profile.

Example (client-side guard):

```js
import { isCurrentUserAdmin } from "/auth/api/auth-api.js";

const canReset = await isCurrentUserAdmin();
if (canReset) {
  // Show or enable admin-only controls
} else {
  // Hide or disable admin-only controls
}
```

### 5.4 Existing Auth Helpers (for completeness)

- `signUp(email, password)` – create a new auth user.
- `login(email, password)` – email/password sign-in.
- `logout()` – sign out.
- `resetPassword(email)` – send password reset email.
- `checkAuth()` – Promise that resolves with the user if logged in, rejects otherwise.
- `getCurrentUser()` – returns `auth.currentUser` (or `null`).
- `updateUserProfile(user, data)` – wraps `updateProfile`.
- `signInWithGoogle()` – Google OAuth sign-in (and ensures a user document exists).

---

## 6. Leaderboard Team: How to Use Admin Status

### 6.1 Client-Side Usage (UI / Buttons)

- To show an admin-only button (e.g., "Reset Leaderboard"):

```js
import { isCurrentUserAdmin } from "/auth/api/auth-api.js";

async function initLeaderboardPage() {
  const resetBtn = document.getElementById("reset-leaderboard-btn");
  const isAdmin = await isCurrentUserAdmin();

  if (isAdmin) {
    resetBtn.style.display = "block";
  } else {
    resetBtn.style.display = "none";
  }
}

initLeaderboardPage();
```

### 6.2 Server-Side / Cloud Functions (if used)

If you use Cloud Functions with the Admin SDK to reset leaderboards:

- **Important:** Admin SDK bypasses Firestore rules, so you must manually enforce admin checks.
- Pattern:
  1. Function is called by an authenticated user.
  2. In the function, read `users/{uid}` (from Firestore) using the Admin SDK.
  3. Check `isAdmin === true`.
  4. Only perform reset operations if the check passes.

This mirrors what the Firestore rules do for client-side deletes.

---

## 7. Operational Steps: Firebase CLI and Rules Deployment

### 7.1 One-Time Setup: Install Firebase CLI (Locally)

On your machine (Windows):

```bash
npm install -g firebase-tools
```

Verify installation:

```bash
firebase --version
```

### 7.2 Login to Firebase

```bash
firebase login
```

- Follow the browser prompts and select the same Google account that owns the `zat-am-main` project.

### 7.3 Initialize Firebase in the Project (If Not Already Done)

From the project root (`zat.am`):

```bash
cd c:/src/coop/sheridancollege/new/zat.am
firebase init
```

During `firebase init`:

1. Select **Firestore** (and any other features you need, e.g., Hosting).
2. Choose existing project: **`zat-am-main`**.
3. For Firestore rules file, point to `firestore.rules` (already created).
4. For Firestore indexes, accept the default (`firestore.indexes.json`).

This will create/update local Firebase config files (e.g., `.firebaserc`, `firebase.json`).

### 7.4 Deploy Firestore Rules

Any time you update `firestore.rules`, deploy with:

```bash
firebase deploy --only firestore:rules
```

This pushes the local rules to the live project.

### 7.5 (Optional) Deploy Hosting / Functions

If you also manage hosting or Cloud Functions via Firebase, use:

```bash
firebase deploy
# or
firebase deploy --only hosting
firebase deploy --only functions
```

This is independent of admin status, but it may be part of your overall workflow.

---

## 8. How to Assign and Test Admin Status

### 8.1 Assign Admin via Firestore Console (Recommended for Now)

1. Go to Firebase console → Firestore → `users` collection.
2. Find the user document by `uid` (after they have signed up/logged in once).
3. Edit the document:
   - Set `isAdmin` to `true`.
4. Save the document.

The user is now an admin according to both the frontend helper functions and Firestore rules.

### 8.2 End-to-End Test Scenario

**Step 1 – Create a normal user**

1. Visit `/auth/signup.html`.
2. Sign up with a name, email, and password.
3. In Firebase console → Firestore → `users` collection:
   - Verify a document with the new `uid` exists.
   - Confirm fields: `email`, `name`, `isAdmin: false`, `createdAt`.

**Step 2 – Promote this user to admin**

1. In Firestore console, open their `users/{uid}` doc.
2. Set `isAdmin` to `true`.
3. Save.

**Step 3 – Verify admin helpers**

While logged in as this user, open browser DevTools console on any page that loads the Firebase app and run:

```js
import("/auth/api/auth-api.js").then(async m => {
  const profile = await m.getCurrentUserProfile();
  console.log("Profile:", profile);
  const isAdmin = await m.isCurrentUserAdmin();
  console.log("isAdmin:", isAdmin);
});
```

You should see:

- `profile.isAdmin === true`
- `isAdmin: true`

**Step 4 – Verify non-admin behavior**

1. Log out.
2. Create or log in as a different, non-admin user.
3. Run the same console snippet.

You should see:

- `profile.isAdmin === false` (or `null` if no profile yet).
- `isAdmin: false`.

**Step 5 – Leaderboard behavior (once implemented)**

- Client-side: Admin users see and can click the reset button; non-admins do not.
- Firestore rules: Only admin users can perform delete/reset operations according to the leaderboard rules once enabled.

---

## 9. Summary

- Admin status is represented by `isAdmin` in `users/{uid}`.
- Client-side code **never** directly changes `isAdmin` on existing users.
- Firestore rules enforce who can read/write user documents and who is allowed to perform admin-only operations (e.g., leaderboard resets).
- Helper functions `getCurrentUserProfile()` and `isCurrentUserAdmin()` provide a clean API for teams to work with admin status.
- Firebase CLI is used to manage and deploy Firestore rules (`firebase deploy --only firestore:rules`).

If you need more functionality (e.g., an admin panel to manage `isAdmin` flags via UI), it should build on top of these helpers and respect the existing Firestore rules.
