import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

export function hasAdminCredentials(): boolean {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  return Boolean(serviceAccountKey || (privateKey && clientEmail));
}

function getAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0]!;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'kings-platter-menu';

  if (serviceAccountKey) {
    try {
      const parsedKey = JSON.parse(serviceAccountKey);
      return initializeApp({
        credential: cert(parsedKey),
        storageBucket: `${projectId}.appspot.com`,
      });
    } catch {
      console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON.');
    }
  }

  if (privateKey && clientEmail) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: `${projectId}.appspot.com`,
    });
  }

  return initializeApp({
    projectId,
    storageBucket: `${projectId}.appspot.com`,
  });
}

const adminApp = getAdminApp();

export const serverDb: Firestore = getFirestore(adminApp);
export const serverAuth: Auth = getAuth(adminApp);
export const serverStorage: Storage = getStorage(adminApp);

export default adminApp;
