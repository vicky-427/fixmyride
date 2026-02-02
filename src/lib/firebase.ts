import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDVNEXcRTHLGpALhXxb6N07gIOPilhbcA8",
  authDomain: "studio-3890367021-ba82b.firebaseapp.com",
  projectId: "studio-3890367021-ba82b",
  storageBucket: "studio-3890367021-ba82b.appspot.com",
  messagingSenderId: "1060483010844",
  appId: "1:1060483010844:web:a6e7b64cb77a53621dead9",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, firebaseConfig };
