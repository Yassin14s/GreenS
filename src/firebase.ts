import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB-9CuvX5IuU4hpgpcn958SYsgxqs_SSaY",
  authDomain: "signs-29113.firebaseapp.com",
  projectId: "signs-29113",
  storageBucket: "signs-29113.firebasestorage.app",
  messagingSenderId: "938068004338",
  appId: "1:938068004338:web:e3c6a5aeaddf67c2a0ef6b"
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
