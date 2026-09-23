import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

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

let firestoreAppInstance: App | null = null;
let serverDbInstance: Firestore | null = null;

export function getAdminFirestoreApp(): App {
  if (firestoreAppInstance) {
    return firestoreAppInstance;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    firestoreAppInstance = existingApps[0]!;
    return firestoreAppInstance;
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
      firestoreAppInstance = initializeApp({
        credential: cert(parsedKey),
        storageBucket: `${projectId}.appspot.com`,
      });
      return firestoreAppInstance;
    } catch {
      console.warn('[FirebaseAdminFirestore] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON.');
    }
  }

  if (privateKey && clientEmail) {
    firestoreAppInstance = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: `${projectId}.appspot.com`,
    });
    return firestoreAppInstance;
  }

  firestoreAppInstance = initializeApp({
    projectId,
    storageBucket: `${projectId}.appspot.com`,
  });
  return firestoreAppInstance;
}

export function getAdminDb(): Firestore {
  if (!serverDbInstance) {
    const app = getAdminFirestoreApp();
    serverDbInstance = getFirestore(app);
  }
  return serverDbInstance;
}

export const serverDb: Firestore = getAdminDb();
export default getAdminFirestoreApp;
