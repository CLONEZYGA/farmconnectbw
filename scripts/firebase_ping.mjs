// Simple Node script to check connectivity to the project's Realtime Database URL.
// Usage (Windows cmd):
//   node scripts\firebase_ping.mjs

const databaseURL = 'https://farmconnect-bw-default-rtdb.firebaseio.com';

async function ping() {
  try {
    const res = await fetch(`${databaseURL}/.json`);
    console.log('HTTP status:', res.status, res.statusText);

    const text = await res.text();
    if (!text) {
      console.log('Empty response body');
      return;
    }

    // Print a short preview of the response to avoid huge logs
    const preview = text.length > 1000 ? text.slice(0, 1000) + '... (truncated)' : text;
    console.log('Response preview:', preview);
  } catch (err) {
    console.error('Ping failed:', err);
    process.exitCode = 2;
  }
}

// Top-level run
ping();
