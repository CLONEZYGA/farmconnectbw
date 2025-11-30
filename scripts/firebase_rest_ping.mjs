// Signs in using Firebase REST API to obtain an ID token, then requests the Realtime Database with the token.
// Usage: node scripts\firebase_rest_ping.mjs

const API_KEY = 'AIzaSyDVvIBHbdAkK6IVEU6mQE5yh7A3iSW2-Vg'; // from config/firebase.ts
const databaseURL = 'https://farmconnect-bw-default-rtdb.firebaseio.com';

// Predefined test account (from config/PREDEFINED_USERS)
const email = 'farmer@farmconnectbw.com';
const password = 'farmer123';

async function signInAndPing() {
  try {
    // Sign in to get idToken
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    const signInRes = await fetch(signInUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });

    const signInJson = await signInRes.json();
    if (!signInRes.ok) {
      console.error('Sign-in failed:', signInJson);
      process.exitCode = 2;
      return;
    }

    const idToken = signInJson.idToken;
    console.log('Obtained idToken (truncated):', idToken?.slice(0, 40));

    // Use idToken to query the Realtime Database
    const dbRes = await fetch(`${databaseURL}/.json?auth=${idToken}`);
    console.log('DB request status:', dbRes.status, dbRes.statusText);
    const dbText = await dbRes.text();
    const preview = dbText.length > 1000 ? dbText.slice(0, 1000) + '... (truncated)' : dbText;
    console.log('DB response preview:', preview);
  } catch (err) {
    console.error('Error during sign-in/ping:', err);
    process.exitCode = 2;
  }
}

signInAndPing();
