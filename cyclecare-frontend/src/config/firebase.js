import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBrtnlC9bAq-MJczU50MzQAQBbR-ahO6fU",
  authDomain: "cycle-care-9d45b.firebaseapp.com",
  projectId: "cycle-care-9d45b",
  storageBucket: "cycle-care-9d45b.firebasestorage.app",
  messagingSenderId: "1059388556255",
  appId: "1:1059388556255:web:53df579872dc4faab9ba6a",
  measurementId: "G-4V3Z2P1HH7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
