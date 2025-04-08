import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBRFQXcPuLOYw0gBEhLnR4Ops2hAu57yMk",
  authDomain: "signc-286a4.firebaseapp.com",
  projectId: "signc-286a4",
  storageBucket: "signc-286a4.firebasestorage.app",
  messagingSenderId: "152927632607",
  appId: "1:152927632607:web:ce3085a141794c818ffd6a",
  measurementId: "G-1N991ZK4YF"
};

// Initialize Firebase only if no app exists
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
