import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, PREDEFINED_USERS } from '../config/firebase';

export async function testSignIn() {
  try {
    const creds = PREDEFINED_USERS.farmer;
    const userCred = await signInWithEmailAndPassword(auth, creds.email, creds.password);
    console.log('Signed in UID:', userCred.user.uid);
    const token = await userCred.user.getIdToken();
    console.log('ID token length:', token.length);
    return { uid: userCred.user.uid, tokenSample: token.slice(0, 40) };
  } catch (err) {
    console.error('testSignIn failed:', err);
    throw err;
  }
}
