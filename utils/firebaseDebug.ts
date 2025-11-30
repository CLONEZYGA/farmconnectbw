import { database } from '../config/firebase';
import { ref as dbRef, get as dbGet } from 'firebase/database';
import { auth } from '../config/firebase';

export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;
  const snapshot = await dbGet(dbRef(database, `users/${user.uid}`));
  return snapshot.exists() ? snapshot.val() : null;
}
