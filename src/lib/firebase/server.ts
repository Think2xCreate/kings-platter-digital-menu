import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

function getPrivateKey(): string | undefined {
  let rawKey =
    process.env.FIREBASE_PRIVATE_KEY ||
    (process.env.FIREBASE_PRIVATE_KEY_PART1 && process.env.FIREBASE_PRIVATE_KEY_PART2
      ? process.env.FIREBASE_PRIVATE_KEY_PART1 + process.env.FIREBASE_PRIVATE_KEY_PART2
      : undefined);

  if (!rawKey) return undefined;
  rawKey = rawKey.trim();
  if ((rawKey.startsWith('"') && rawKey.endsWith('"')) || (rawKey.startsWith("'") && rawKey.endsWith("'"))) {
    rawKey = rawKey.slice(1, -1);
  }
  return rawKey.replace(/\\n/g, '\n');
}

export function hasAdminCredentials(): boolean {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const privateKey = getPrivateKey();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  return Boolean(serviceAccountKey || (privateKey && clientEmail));
}

function getAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0]!;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const privateKey = getPrivateKey();
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
    console.log(`[FirebaseAdmin] Initializing with service account cert for project: ${projectId}`);
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: `${projectId}.appspot.com`,
    });
  }

  console.log(`[FirebaseAdmin] Warning: Initializing WITHOUT credentials for project: ${projectId}`);
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
