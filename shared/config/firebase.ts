import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Admin Firebase configuration
export const adminFirebaseConfig = {
  apiKey: process.env.FIREBASE_ADMIN_API_KEY || '',
  authDomain: process.env.FIREBASE_ADMIN_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_ADMIN_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_ADMIN_APP_ID || ''
};

// User Firebase configuration
export const userFirebaseConfig = {
  apiKey: process.env.FIREBASE_USER_API_KEY || '',
  authDomain: process.env.FIREBASE_USER_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_USER_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_USER_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_USER_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_USER_APP_ID || ''
};

// Initialize Firebase for admin platform
export function initializeAdminFirebase() {
  const app = initializeApp(adminFirebaseConfig, 'admin');
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const database = getDatabase(app);

  return {
    app,
    auth,
    firestore,
    database
  };
}

// Initialize Firebase for user platform
export function initializeUserFirebase() {
  const app = initializeApp(userFirebaseConfig, 'user');
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const database = getDatabase(app);

  return {
    app,
    auth,
    firestore,
    database
  };
}