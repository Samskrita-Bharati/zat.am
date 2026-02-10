import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "./firebase-config.js";

const googleProvider = new GoogleAuthProvider();

export const signUp = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};

export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

export const checkAuth = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject(null);
      }
    });
  });
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const updateUserProfile = async (user, data) => {
  return await updateProfile(user, data);
};

// Sign in with Google and ensure Firestore user document exists
export const signInWithGoogle = async () => {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred;
};

// Ensure there are Firestore user documents for the given user
// in the new, nested structure:
//   users/{uid}/private/account   -> email, isAdmin, createdAt
//   users/{uid}/public/profile    -> name, language, location, etc.
// Creates docs only if missing, with isAdmin defaulting to false.
// Never changes isAdmin on existing docs (respecting security rules).
export const ensureUserDocument = async (user, extraData = {}) => {
  if (!user) return;

  const accountRef = doc(db, "users", user.uid, "private", "account");
  const profileRef = doc(db, "users", user.uid, "public", "profile");

  const [accountSnap, profileSnap] = await Promise.all([
    getDoc(accountRef),
    getDoc(profileRef),
  ]);

  const { displayName, email } = user;

  // Never allow callers to override isAdmin from the client
  const { isAdmin, ...safeExtraData } = extraData || {};

  // Track if this is a new user
  const isNewUser = !accountSnap.exists() && !profileSnap.exists();

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
      streak: 1
    });
  }

  return isNewUser;
};

// Fetch the current user's profile data from the new structure
// and merge private/public fields into a single convenient object.
export const getCurrentUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const accountRef = doc(db, "users", user.uid, "private", "account");
  const profileRef = doc(db, "users", user.uid, "public", "profile");

  const [accountSnap, profileSnap] = await Promise.all([
    getDoc(accountRef),
    getDoc(profileRef),
  ]);

  if (!accountSnap.exists() && !profileSnap.exists()) return null;

  const account = accountSnap.exists() ? accountSnap.data() : {};
  const profile = profileSnap.exists() ? profileSnap.data() : {};

  return {
    id: user.uid,
    email: account.email || user.email || "",
    isAdmin: !!account.isAdmin,
    createdAt: account.createdAt || profile.createdAt || null,
    ...profile,
  };
};

// Convenience helper for other teams (e.g., leaderboards)
// to quickly check if the logged-in user is an admin.
export const isCurrentUserAdmin = async () => {
  const profile = await getCurrentUserProfile();
  return !!(profile && profile.isAdmin === true);
};

// Change Password Method
export const changePassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;

  // authenticate again user with current password
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  // Update to new password
  return await updatePassword(user, newPassword);
};

export const updateUserPreferences = async (user, preferences) => {
  const profileRef = doc(db, "users", user.uid, "public", "profile");

  // Add default values for language, country, and region if not provided
  const preferencesWithDefaults = {
    ...preferences,
    language: preferences.language || "1",
    country: preferences.country || "",
    region: preferences.region || "",
    location: preferences.location || "",
  };

  return await setDoc(profileRef, preferencesWithDefaults, { merge: true });
};
