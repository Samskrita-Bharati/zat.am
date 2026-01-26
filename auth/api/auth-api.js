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
} from "./firebase-config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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

export const signInWithGoogle = async () => {
  const cred = await signInWithPopup(auth, googleProvider);
  // Ensure a Firestore user document exists for this account
  await ensureUserDocument(cred.user);
  return cred;
};

// Ensure there is a Firestore user document for the given user.
// Creates it only if missing, with isAdmin defaulting to false.
// This respects security rules by never changing isAdmin on existing docs.
export const ensureUserDocument = async (user, extraData = {}) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    // Do not modify existing documents here (especially isAdmin).
    return;
  }

  const { displayName, email } = user;

  // Never allow callers to override isAdmin from the client
  const { isAdmin, ...safeExtraData } = extraData || {};

  await setDoc(userRef, {
    email: email || "",
    name: displayName || safeExtraData.name || "",
    isAdmin: false,
    createdAt: serverTimestamp(),
    ...safeExtraData,
  });
};

// Fetch the current user's profile document from Firestore
export const getCurrentUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...snapshot.data() };
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
