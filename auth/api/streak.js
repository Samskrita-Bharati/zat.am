import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

export async function updateStreak(userUid) {
  let streakChange = true;
  const profileRef = doc(db, "users", userUid, "public", "profile");
  const snap = await getDoc(profileRef);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 1;
  let lastLogin = null;

  if (snap.exists()) {
    const data = snap.data();
    streak = data.streak || 0;
    lastLogin = data.lastLogin ? data.lastLogin.toDate() : null;
  }

  if (lastLogin) {
    lastLogin.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) streak += 1;
    else if (diffDays > 1) streak = 1;
    else streakChange = false;
  }

  if (streakChange) {
    await updateDoc(profileRef, {
      streak,
      lastLogin: Timestamp.fromDate(today)
    });
  }

  return streak;
}