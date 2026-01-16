import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "./firebase-config";

export const signUp = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
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
