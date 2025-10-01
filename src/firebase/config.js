import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBX--DvWSqPT00fh85PeHJZCxSY3NG9hhE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lingvist-plus.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lingvist-plus",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lingvist-plus.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "449593151353",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:449593151353:web:6151bd408271616a65e9a8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TP4TX39FPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
