import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { config } from './config';

// Initialize Firebase
export const app = initializeApp(config.firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
