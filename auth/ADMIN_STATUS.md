# Auth Admin Role & Bilingual / Transliteration Architecture

This document explains two cross-cutting features of the zat.am web app:

1. How **admin status** is modeled in Firebase Auth + Firestore and consumed by the frontend.
2. How the **bilingual / transliteration system** works end-to-end (preferences → navbar → URLs → games), including the new shared bp26 transliteration module.

It is written for future contributors who may adjust or extend the current implementation.

---

## 1. High-Level Overview

- Firebase Auth is the source of truth for user identities.
- Firestore stores per-user metadata in a nested structure under `users/{uid}`:
  - `users/{uid}/private/account` – sensitive fields (email, `isAdmin`, `createdAt`).
  - `users/{uid}/public/profile` – non-sensitive fields (display name, language, location, preferences flags).
- Admin status (`isAdmin`) is read from Firestore and never set from untrusted client input.
- Bilingual/transliteration behavior is driven by:
  - Preferred language code stored in Firestore and mirrored in localStorage.
  - A bilingual on/off flag stored in localStorage and exposed globally.
  - URL query parameter `t` that transliteration-capable pages consume.
  - The shared helper `bp26/js/transliteration.js` for bp26 game pages.

Key implementation files:

- Auth/admin:
  - `auth/api/firebase-config.js`
  - `auth/api/auth-api.js`
  - `firestore.rules`
  - `auth/js/signup.js`, `auth/js/login.js`, `auth/js/profile.js`, `auth/js/preferences.js`
  - `auth/api/middleware.js`, `js/navbar-auth.js`
- Bilingual/transliteration:
  - `auth/js/preferences.js`, `auth/js/profile.js`
  - `js/navbar-auth.js`, `js/bilingual-toggle.js`
  - `app.js` (main menu / game links)
  - `bp26/js/transliteration.js` (shared transliteration utility)
  - bp26 pages that include that helper (for example `bp26/fnd.html`, `bp26/fw.html`, `bp26/lrn.html`, `bp26/mk.html`, `bp26/ma.html`, and ZIM variants).

---

## 2. Firestore Data Model for Auth & Admin

### 2.1 Document Layout

Each authenticated user has documents under the top-level `users` collection:

```text
users/{uid}/private/account   # sensitive account info
users/{uid}/public/profile    # public profile + preferences
```

- `users/{uid}/private/account` fields:
  - `email` (string) – copied from Firebase Auth.
  - `isAdmin` (boolean) – whether this user is an admin. Default: `false`.
  - `createdAt` (timestamp) – `serverTimestamp()` when the account doc is created.

- `users/{uid}/public/profile` fields (current usage):
  - `name` (string) – display name.
  - `language` (string) – preferred second-language code (see section 5.1).
  - `country` (string) – country name.
  - `region` (string) – province/state where applicable.
  - `location` (string) – combined location string.
  - `preferencesSet` (boolean) – whether the user completed preferences.
  - `streak` (number) – current streak value.
  - `createdAt` (timestamp) – set on first profile creation.

### 2.2 Creation & Idempotency (`ensureUserDocument`)

File: `auth/api/auth-api.js`

`ensureUserDocument(user, extraData)`:

- Returns early if no `user`.
- Reads both:
  - `users/{uid}/private/account`
  - `users/{uid}/public/profile`
- If missing, creates them with safe defaults.
- Explicitly strips `isAdmin` from `extraData` so callers cannot client-set admin.
- Returns `isNewUser` when both docs were previously absent.

Key points:

- Safe to call from all login paths (email/password, Google).
- Existing docs are not overwritten.
- `isAdmin` cannot be escalated by untrusted client input.

### 2.3 Reading Admin Status (`getCurrentUserProfile`, `isCurrentUserAdmin`)

File: `auth/api/auth-api.js`

- `getCurrentUserProfile()`:
  - Reads both nested docs.
  - Merges account + profile into a single object for frontend use.
  - Returns `isAdmin` from `private/account`.

- `isCurrentUserAdmin()`:
  - Wraps `getCurrentUserProfile()`.
  - Returns `true` only if `profile.isAdmin === true`.

Used by profile/admin-aware UI and reusable for leaderboard/admin controls.

### 2.4 Firestore Security Rules

File: `firestore.rules`

Helpers:

- `isSignedIn()`
- `isOwner(userId)`
- `isAdmin()` (reads `users/{uid}/private/account.isAdmin`)

Behavior:

- Base `users/{userId}` doc:
  - Create/read allowed to owner; read also allowed to admin.
  - Update/delete denied.

- `users/{userId}/private/{docId}`:
  - Owner and admin can read.
  - Owner can create own private doc but cannot set `isAdmin: true`.
  - Owner can update private doc except changing `isAdmin`.
  - Admin can update other users only when changed keys are exactly `['isAdmin']`.
  - Deletes denied.

- `users/{userId}/public/{docId}`:
  - Public read.
  - Owner-only create/update.
  - Deletes denied.

- `leaderboards`:
  - Public read.
  - Signed-in write (current broad rule; tighten later by game/team requirements).

- `admin-logs`:
  - Read admin-only.
  - Writes currently denied.

- Catch-all: deny all.

Admin flag lifecycle:

- New users start with `isAdmin: false`.
- Promotion/demotion should happen via trusted mechanisms:
  - Firestore console,
  - Admin SDK / Cloud Function,
  - future admin-only tooling that respects these rules.

---

## 3. Auth Flows & Where Admin Fits

### 3.1 Signup (`auth/js/signup.js`)

1. `signUp(email, password)` creates Firebase Auth user.
2. `updateUserProfile(user, { displayName: name })` updates Auth profile.
3. `ensureUserDocument(user, { name })` creates nested Firestore docs if missing.
4. Email verification is sent and user is signed out until verified.

### 3.2 Login (`auth/js/login.js`)

- Email/password login:
  - blocks access if email not verified,
  - calls `ensureUserDocument(user)` for backfill,
  - reads profile to decide preferences flow.

- Google login:
  - signs in via OAuth,
  - calls `ensureUserDocument(cred.user)`.

### 3.3 Protected Routes (`auth/api/middleware.js`)

- `bp26` pages require authenticated user.
- Middleware redirects unauthenticated users to login with redirect URL.
- This is auth-only (not admin-only).

### 3.4 Profile & Role Display (`auth/js/profile.js`)

- `checkAuth()` ensures login.
- `getCurrentUserProfile()` provides merged data.
- Role badge/row uses `profile.isAdmin`.
- Profile editing updates public profile only; does not edit `private/account.isAdmin`.

---

## 4. Bilingual / Transliteration System

This section reflects the current architecture after bp26 transliteration refactor.

### 4.1 Language Codes

Preferred language is represented by short codes:

- `1` (itrans fallback/script mapping)
- `gu`, `ka`, `be`, `ml`, `te`, `ta`
- `ia` (iast)

These codes are stored in:

- Firestore profile: `users/{uid}/public/profile.language`
- localStorage: `zatPreferredLang`
- global state: `window.zatPreferredLang`

### 4.2 Preferences Flow (`auth/js/preferences.js`)

User sets language + location fields; `updateUserPreferences(user, prefs)` merges into public profile and defaults missing values.

### 4.3 Navbar State (`js/navbar-auth.js`)

- On auth state changed:
  - load profile language into global + localStorage.
  - read bilingual toggle flag (`zatBilingualOn`).
- Toggle button:
  - requires preferred language when turning on,
  - persists flag,
  - triggers `window.zatRefreshMenu()` and `window.zatSyncBilingualQueryParam()` if present.

### 4.4 URL Sync (`js/bilingual-toggle.js`)

This helper keeps URL `t` aligned with global bilingual state:

- Normalizes legacy `t=1` in supported contexts.
- Adds/removes `t` based on `zatBilingualOn` and preferred language.
- Exposes `window.zatSyncBilingualQueryParam()` for navbar-triggered sync.

### 4.5 Main Menu Link Injection (`app.js`)

Main menu currently appends `?t=<preferredLang>` for bp26 links when bilingual is on.

### 4.6 Shared bp26 Transliteration Module (`bp26/js/transliteration.js`)

The bp26 pages now use a shared helper instead of duplicating `tlang` arrays and raw `Sanscript.t(...)` calls everywhere.

Exports via `window.bp26Translit`:

- `LANG_MAP` – code → Sanscript target mapping.
- `getRawT(search?)` – reads raw URL `t`.
- `getTargetScript(search?)` – resolves `t` into target script or `null`.
- `transliterate(text, from?, options?)` – safe conversion with optional target/fallback.
- `numberToDevanagari(value)` – utility for score/counter display.

Behavior details:

- If `Sanscript` is not available, returns original text.
- If `t` is unsupported/missing, returns original text unless `fallback` is specified.
- Catches conversion errors and fails safely.

### 4.7 bp26 Pages Migrated to Shared Helper

Main games:

- `bp26/lrn.html`
- `bp26/mk.html`
- `bp26/fnd.html`
- `bp26/fw.html`
- `bp26/ma.html`

ZIM variants:

- `bp26/z3.html`
- `bp26/z5.html`
- `bp26/z6.html`
- `bp26/zim3.html`

Additional ZIM updates:

- Shared header + bilingual toggle wiring added to the above pages.
- Canvas offset logic added so game content renders below fixed header.
- `z6` includes hover popup word text with transliteration fallback (`itrans`) when bilingual is off.

---

## 5. Extending or Modifying

### 5.1 Add a New Language

1. Add option to preferences/profile language selectors.
2. Add label mapping in profile/navbar UI.
3. Extend `LANG_MAP` in `bp26/js/transliteration.js` (and any non-bp26 transliteration maps still using local arrays).

### 5.2 Make a New Page Respect Bilingual Mode

1. Include `../js/bilingual-toggle.js` (or correct relative path).
2. Read `t` from URL as needed.
3. For bp26 pages, use `window.bp26Translit` rather than per-page maps.
4. Optionally ensure main menu appends `t` for that game directory in `app.js`.

### 5.3 Admin-Only UI / Actions

1. Require auth (`checkAuth()` / `onAuthStateChanged`).
2. Gate UI/action with `isCurrentUserAdmin()`.
3. Ensure corresponding write paths are admin-protected in Firestore rules or moved to trusted backend.

---

## 6. Firebase CLI Operational Notes

Install and use Firebase CLI as needed:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

Deploy other targets (`hosting`, `functions`) as needed by your workflow.

---

## 7. Quick Admin Testing

1. Create/login user.
2. Verify docs exist at:
   - `users/{uid}/private/account`
   - `users/{uid}/public/profile`
3. Promote in console by setting `private/account.isAdmin = true`.
4. Validate with:

```js
import("/auth/api/auth-api.js").then(async (m) => {
  console.log(await m.getCurrentUserProfile());
  console.log("isAdmin:", await m.isCurrentUserAdmin());
});
```

---

If auth, Firestore structure, or transliteration wiring changes again, update this file so it remains the single source of truth.
