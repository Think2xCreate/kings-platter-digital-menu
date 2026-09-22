import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

function getCleanEnv(name: string): string | undefined {
  const val = process.env[name];
  if (!val) return undefined;
  let clean = val.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1).trim();
  }
  return clean || undefined;
}

const firebaseConfig = {
  apiKey: getCleanEnv('NEXT_PUBLIC_FIREBASE_API_KEY') || 'AIzaSyMockKeyForDevelopmentOnly12345',
  authDomain: getCleanEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN') || 'kings-platter-menu.firebaseapp.com',
  projectId: getCleanEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID') || 'kings-platter-menu',
  storageBucket: getCleanEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET') || 'kings-platter-menu.appspot.com',
  messagingSenderId: getCleanEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID') || '123456789012',
  appId: getCleanEnv('NEXT_PUBLIC_FIREBASE_APP_ID') || '1:123456789012:web:abc123def456',
};

// Singleton Firebase Client Application
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;
