import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/security/auth';
import { serverDb, hasAdminCredentials } from '@/lib/firebase/admin-firestore';
import { serverAuth } from '@/lib/firebase/admin-auth';

const MAX_ADMIN_LIMIT = 3;

export async function POST(request: NextRequest) {
  try {
    if (!hasAdminCredentials()) {
      return NextResponse.json({
        success: false,
        error: { code: 'CONFIG_ERROR', message: 'Firebase Admin SDK not configured.' },
      }, { status: 500 });
    }

    // Must be invoked by an authorized existing admin unless initializing the first admin account
    const adminsSnapshot = await serverDb.collection('admins').get();
    const activeAdminsCount = adminsSnapshot.docs.filter(d => d.data().isActive !== false).length;

    if (activeAdminsCount > 0) {
      const authResult = await verifyAdminAuth(request);
      if (!authResult.isAuthorized) {
        return NextResponse.json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Only active administrators can create new admin accounts.' },
        }, { status: 401 });
      }
    }

    // Enforce 3-admin limit server-side inside Firestore transaction check
    if (activeAdminsCount >= MAX_ADMIN_LIMIT) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ADMIN_LIMIT_REACHED',
          message: `Maximum admin account limit (${MAX_ADMIN_LIMIT}) reached. Cannot create additional admin accounts.`,
        },
      }, { status: 400 });
    }

    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || password.length < 6) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Valid email and password (min 6 chars) are required.' },
      }, { status: 400 });
    }

    // Atomic transaction re-check to prevent race condition concurrency issues
    const transactionSuccess = await serverDb.runTransaction(async (transaction) => {
      const currentAdminsSnap = await transaction.get(serverDb.collection('admins'));
      const count = currentAdminsSnap.docs.filter(d => d.data().isActive !== false).length;

      if (count >= MAX_ADMIN_LIMIT) {
        return false;
      }
      return true;
    });

    if (!transactionSuccess) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ADMIN_LIMIT_REACHED',
          message: `Maximum admin account limit (${MAX_ADMIN_LIMIT}) reached concurrently.`,
        },
      }, { status: 400 });
    }

    let userRecord;
    try {
      userRecord = await serverAuth.getUserByEmail(email.trim());
    } catch {
      userRecord = await serverAuth.createUser({
        email: email.trim(),
        password: password.trim(),
        displayName: name || 'Admin User',
      });
    }

    const adminDocRef = serverDb.collection('admins').doc(userRecord.uid);
    await adminDocRef.set({
      uid: userRecord.uid,
      email: userRecord.email,
      name: name || userRecord.displayName || 'Admin User',
      role: role || 'Super Admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: name || userRecord.displayName,
        role: role || 'Super Admin',
        isActive: true,
      },
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Admin creation failed';
    return NextResponse.json({ success: false, error: { code: 'CREATE_FAILED', message } }, { status: 500 });
  }
}
