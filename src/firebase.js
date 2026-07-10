import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBR0bk7xUxHwKYA0l8QYOSzNp2xkZL_VmY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "albabeautysettersystem.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "albabeautysettersystem",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "albabeautyssettersystem.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "830149463357",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:830149463357:web:09258a6fb92847b7d20954",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-SJQWD0GQ0Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('Firebase persistence error:', error);
});

export default app;
