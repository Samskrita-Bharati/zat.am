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
 
  apiKey: "AIzaSyC8nm8zQR6fiC_3mTQ3hURXNJPR6faKYOU",
 
  authDomain: "zat-am-main.firebaseapp.com",
 
  projectId: "zat-am-main",
 
  storageBucket: "zat-am-main.firebasestorage.app",
 
  messagingSenderId: "1071341524876",
 
  appId: "1:1071341524876:web:1908319951cd8f50b2e8a9"
 
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
