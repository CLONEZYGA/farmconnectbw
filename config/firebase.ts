// Firebase configuration for FarmConnectBW
// Note: React Native Firebase auto-initializes when you import the modules
// No need to manually initialize the app

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { getDatabase } from 'firebase/database';

// Firebase configuration for FarmConnectBW
const firebaseConfig = {
  apiKey: "AIzaSyDVvIBHbdAkK6IVEU6mQE5yh7A3iSW2-Vg",
  authDomain: "farmconnect-bw.firebaseapp.com",
  databaseURL: "https://farmconnect-bw-default-rtdb.firebaseio.com",
  projectId: "farmconnect-bw",
  storageBucket: "farmconnect-bw.firebasestorage.app",
  messagingSenderId: "60613560422",
  appId: "1:60613560422:web:047e6051e4cec007b745a7",
  measurementId: "G-TCJRMHYSCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

// Pre-configured user accounts for testing
export const PREDEFINED_USERS = {
  farmer: {
    email: 'farmer@farmconnectbw.com',
    password: 'farmer123',
    role: 'farmer',
    name: 'John Farmer',
    farmName: 'Green Valley Farm',
    region: 'Gaborone',
    phoneNumber: '+267 123 456 789'
  },
  buyer: {
    email: 'buyer@farmconnectbw.com',
    password: 'buyer123',
    role: 'buyer',
    name: 'Sarah Buyer',
    company: 'Fresh Market Ltd',
    region: 'Francistown',
    phoneNumber: '+267 987 654 321'
  },
  expert: {
    email: 'expert@farmconnectbw.com',
    password: 'expert123',
    role: 'expert',
    name: 'Dr. Michael Expert',
    specialization: 'Crop Management',
    region: 'Maun',
    phoneNumber: '+267 555 123 456'
  },
  admin: {
    email: 'admin@farmconnectbw.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    department: 'System Administration',
    region: 'Gaborone',
    phoneNumber: '+267 111 222 333'
  }
};

export default app; 