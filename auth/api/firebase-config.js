// Import Firebase from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getAuth,
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
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyC8nm8zQR6fiC_3mTQ3hURXNJPR6faKYOU",
  authDomain: "zat-am-main.firebaseapp.com",
  projectId: "zat-am-main",
  storageBucket: "zat-am-main.firebasestorage.app",
  messagingSenderId: "1071341524876",
  appId: "1:1071341524876:web:1908319951cd8f50b2e8a9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export {
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
  updateDoc,
  serverTimestamp,
};
