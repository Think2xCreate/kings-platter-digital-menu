import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

function cleanEnvStr(val: string | undefined): string {
  if (!val) return '';
  let clean = val.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1).trim();
  }
  return clean;
}

// Next.js static replacement requires explicit literal member expressions (process.env.NEXT_PUBLIC_*)
const firebaseConfig = {
  apiKey: cleanEnvStr(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: cleanEnvStr(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvStr(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvStr(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvStr(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnvStr(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

let clientAppInstance: FirebaseApp | null = null;
let clientAuthInstance: Auth | null = null;
let clientDbInstance: Firestore | null = null;
let clientStorageInstance: FirebaseStorage | null = null;

export function getClientApp(): FirebaseApp {
  if (!clientAppInstance) {
    if (getApps().length > 0) {
      clientAppInstance = getApp();
    } else {
      clientAppInstance = initializeApp(firebaseConfig);
    }
  }
  return clientAppInstance;
}

export function getClientAuth(): Auth {
  if (!clientAuthInstance) {
    const app = getClientApp();
    clientAuthInstance = getAuth(app);
  }
  return clientAuthInstance;
}

export function getClientDb(): Firestore {
  if (!clientDbInstance) {
    const app = getClientApp();
    clientDbInstance = getFirestore(app);
  }
  return clientDbInstance;
}

export function getClientStorage(): FirebaseStorage {
  if (!clientStorageInstance) {
    const app = getClientApp();
    clientStorageInstance = getStorage(app);
  }
  return clientStorageInstance;
}

// Build-safe Lazy Proxies prevent Firebase Web SDK initialization during static page prerendering
export const auth: Auth = new Proxy({} as Auth, {
  get(_target, prop, receiver) {
    const instance = getClientAuth();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

export const db: Firestore = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    const instance = getClientDb();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_target, prop, receiver) {
    const instance = getClientStorage();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

export default getClientApp;
