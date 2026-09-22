import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

function getCleanEnv(name: string): string | undefined {
  const val = process.env[name];
  if (!val) return undefined;
  let clean = val.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1).trim();
  }
  return clean || undefined;
}

function getPrivateKey(): string | undefined {
  const parts = [
    getCleanEnv('FIREBASE_PRIVATE_KEY'),
    getCleanEnv('FIREBASE_PRIVATE_KEY_1'),
    getCleanEnv('FIREBASE_PRIVATE_KEY_2'),
    getCleanEnv('FIREBASE_PRIVATE_KEY_3'),
    getCleanEnv('FIREBASE_PRIVATE_KEY_PART1'),
    getCleanEnv('FIREBASE_PRIVATE_KEY_PART2'),
    getCleanEnv('FIREBASE_PRIVATE_KEY_PART3'),
  ].filter(Boolean);

  if (parts.length === 0) return undefined;
  let rawKey = parts.join('').trim();
  if ((rawKey.startsWith('"') && rawKey.endsWith('"')) || (rawKey.startsWith("'") && rawKey.endsWith("'"))) {
    rawKey = rawKey.slice(1, -1).trim();
  }
  return rawKey.replace(/\\n/g, '\n');
}

export function hasAdminCredentials(): boolean {
  const serviceAccountKey = getCleanEnv('FIREBASE_SERVICE_ACCOUNT_KEY');
  const privateKey = getPrivateKey();
  const clientEmail = getCleanEnv('FIREBASE_CLIENT_EMAIL');
  return Boolean(serviceAccountKey || (privateKey && clientEmail));
}

function getAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0]!;
  }

  const serviceAccountKey = getCleanEnv('FIREBASE_SERVICE_ACCOUNT_KEY');
  const privateKey = getPrivateKey();
  const clientEmail = getCleanEnv('FIREBASE_CLIENT_EMAIL');
  const projectId =
    getCleanEnv('FIREBASE_PROJECT_ID') ||
    getCleanEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID') ||
    'kings-platter-digital-menu';

  if (serviceAccountKey) {
    try {
      const parsedKey = JSON.parse(serviceAccountKey);
      return initializeApp({
        credential: cert(parsedKey),
        storageBucket: `${projectId}.appspot.com`,
      });
    } catch {
      console.warn('[FirebaseAdmin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON.');
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

  console.log(`[FirebaseAdmin] Warning: Initializing without service cert credentials for project: ${projectId}`);
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
