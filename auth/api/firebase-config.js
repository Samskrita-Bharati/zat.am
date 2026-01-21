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
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCpDDpIOxNa46or-8oNfr_GZx0sXfXuwHw",
  authDomain: "zat-am-fd08d.firebaseapp.com",
  projectId: "zat-am-fd08d",
  storageBucket: "zat-am-fd08d.firebasestorage.app",
  messagingSenderId: "625334613977",
  appId: "1:625334613977:web:43bf99d641abab49b00bc8",
  measurementId: "G-D7PSEGRQ5P",
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
};
