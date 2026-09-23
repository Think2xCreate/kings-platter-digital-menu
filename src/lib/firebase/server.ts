import { getAdminFirestoreApp, getAdminDb, hasAdminCredentials as checkAdminCreds } from './admin-firestore';
import { getAdminAuth } from './admin-auth';

export const hasAdminCredentials = checkAdminCreds;
export const serverDb = getAdminDb();
export const serverAuth = getAdminAuth();

export default getAdminFirestoreApp();
