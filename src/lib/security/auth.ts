import { NextRequest } from 'next/server';
import { serverDb, hasAdminCredentials } from '../firebase/admin-firestore';
import { serverAuth } from '../firebase/admin-auth';

export interface AuthResult {
  isAuthorized: boolean;
  uid?: string;
  email?: string;
  role?: string;
  error?: string;
}

/**
 * Validates request authorization header or cookie token against Firebase Admin Auth and Firestore admins/{uid}.
 * Strict production check: Token must be a valid Firebase ID Token, and Firestore admins/{uid} must exist and be active.
 */
export async function verifyAdminAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('Authorization');
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = request.cookies.get('kp_admin_session')?.value;
    }

    if (!token) {
      return {
        isAuthorized: false,
        error: 'Authentication token missing or invalid.',
      };
    }

    if (!hasAdminCredentials()) {
      return {
        isAuthorized: false,
        error: 'Firebase Admin credentials not configured on server.',
      };
    }

    try {
      const decodedToken = await serverAuth.verifyIdToken(token);
      const uid = decodedToken.uid;
      const email = decodedToken.email || '';

      // Verify admin document exists in Firestore admins collection
      let adminDoc = await serverDb.collection('admins').doc(uid).get();
      let adminData = adminDoc.data();

      if (!adminDoc.exists) {
        const queryByUid = await serverDb.collection('admins').where('uid', '==', uid).limit(1).get();
        if (!queryByUid.empty) {
          adminData = queryByUid.docs[0].data();
        } else if (email) {
          const queryByEmail = await serverDb.collection('admins').where('email', '==', email).limit(1).get();
          if (!queryByEmail.empty) {
            adminData = queryByEmail.docs[0].data();
          }
        }
      }

      if (!adminData) {
        return {
          isAuthorized: false,
          error: 'Access denied. Account is not registered as an administrator.',
        };
      }
      
      if (adminData.isActive === false) {
        return {
          isAuthorized: false,
          error: 'Access denied. Administrator account has been deactivated.',
        };
      }

      return {
        isAuthorized: true,
        uid,
        email: email || adminData.email || '',
        role: 'ADMIN',
      };
    } catch {
      return {
        isAuthorized: false,
        error: 'Invalid or expired authentication token.',
      };
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Server authorization failed';
    return {
      isAuthorized: false,
      error: errMessage,
    };
  }
}

