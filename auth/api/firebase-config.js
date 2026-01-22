// Firebase Configuration for zat.am project
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB7f5yLKGE91AZXVJWJGwIOTqOqhaOtPdU",
  authDomain: "test-login-feature-78f63.firebaseapp.com",
  projectId: "test-login-feature-78f63",
  storageBucket: "test-login-feature-78f63.firebasestorage.app",
  messagingSenderId: "18689179105",
  appId: "1:18689179105:web:29cde4be6f6c081155a6a0",
  measurementId: "G-S1XQMFR56V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export {
  auth,
  db,
  analytics,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
};
