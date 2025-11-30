// Attempts to create a predefined user via Firebase Auth REST API (email/password).
// If the user already exists, it proceeds to sign in. Then it queries the Realtime Database using the obtained idToken.
// Usage: node scripts\firebase_create_and_ping.mjs

const API_KEY = 'AIzaSyDVvIBHbdAkK6IVEU6mQE5yh7A3iSW2-Vg'; // from config/firebase.ts
const databaseURL = 'https://farmconnect-bw-default-rtdb.firebaseio.com';

const email = 'farmer@farmconnectbw.com';
const password = 'farmer123';
const displayName = 'John Farmer';

async function signUp() {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName, returnSecureToken: true })
  });
  return res.json();
}

async function signIn() {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  return res.json();
}

async function pingWithToken(idToken) {
  const res = await fetch(`${databaseURL}/.json?auth=${idToken}`);
  const text = await res.text();
  return { status: res.status, text };
}

(async () => {
  try {
    console.log('Attempting to create user (signUp)...');
    const signup = await signUp();
    if (signup.error) {
      if (signup.error.message === 'EMAIL_EXISTS') {
        console.log('User already exists, proceeding to sign in.');
      } else {
        console.error('Sign-up error:', signup);
        // Continue to sign-in attempt below in case of other recoverable errors
      }
    } else {
      console.log('User created:', signup.localId);
    }

    console.log('Signing in...');
    const signin = await signIn();
    if (signin.error) {
      console.error('Sign-in failed:', signin);
      process.exitCode = 2;
      return;
    }

    const idToken = signin.idToken;
    console.log('Obtained idToken (truncated):', idToken?.slice(0, 40));

    console.log('Pinging Realtime Database with idToken...');
    const db = await pingWithToken(idToken);
    console.log('DB status:', db.status);
    console.log('DB response preview:', db.text.length > 1000 ? db.text.slice(0, 1000) + '... (truncated)' : db.text);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exitCode = 2;
  }
})();
