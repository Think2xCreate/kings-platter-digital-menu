import { getAuth, Auth } from 'firebase-admin/auth';
import { getAdminFirestoreApp } from './admin-firestore';

let serverAuthInstance: Auth | null = null;

export function getAdminAuth(): Auth {
  if (!serverAuthInstance) {
    const app = getAdminFirestoreApp();
    serverAuthInstance = getAuth(app);
  }
  return serverAuthInstance;
}

export const serverAuth: Auth = getAdminAuth();
export default getAdminAuth;
