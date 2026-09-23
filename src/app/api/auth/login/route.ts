import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { serverDb, hasAdminCredentials } from '@/lib/firebase/admin-firestore';
import { serverAuth } from '@/lib/firebase/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`login_attempt:${ip}`, 10, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many login attempts. Please wait 1 minute before trying again.' },
      }, { status: 429 });
    }

    if (!hasAdminCredentials()) {
      return NextResponse.json({
        success: false,
        error: { code: 'CONFIG_ERROR', message: 'Firebase Admin credentials not configured.' },
      }, { status: 500 });
    }

    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Firebase authentication ID token is required.' },
      }, { status: 400 });
    }

    let uid: string;
    let email: string;

    try {
      const decodedToken = await serverAuth.verifyIdToken(idToken);
      uid = decodedToken.uid;
      email = decodedToken.email || '';
    } catch {
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired authentication token.' },
      }, { status: 401 });
    }

    // Primary Firestore lookup by document path admins/{uid}
    let adminDoc = await serverDb.collection('admins').doc(uid).get();
    let adminData = adminDoc.data();

    // Fallback lookup by query if document path doc(uid) doesn't exist yet
    if (!adminDoc.exists) {
      const queryByUid = await serverDb.collection('admins').where('uid', '==', uid).limit(1).get();
      if (!queryByUid.empty) {
        adminData = queryByUid.docs[0].data();
        adminDoc = queryByUid.docs[0];
      } else if (email) {
        const queryByEmail = await serverDb.collection('admins').where('email', '==', email).limit(1).get();
        if (!queryByEmail.empty) {
          adminData = queryByEmail.docs[0].data();
          adminDoc = queryByEmail.docs[0];
        }
      }
    }

    if (!adminData) {
      return NextResponse.json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Access denied. Account is not registered as an administrator.' },
      }, { status: 403 });
    }

    if (adminData.isActive === false) {
      return NextResponse.json({
        success: false,
        error: { code: 'ACCOUNT_DISABLED', message: 'Access denied. Administrator account is deactivated.' },
      }, { status: 403 });
    }

    // Normalize document in admins/{uid} path for security rules and future primary path hits
    const normalizedAdminRecord = {
      uid,
      email: email || adminData.email || '',
      displayName: adminData.displayName || adminData.name || 'Admin',
      name: adminData.name || adminData.displayName || 'Admin',
      role: 'ADMIN',
      isActive: true,
      updatedAt: new Date().toISOString(),
    };

    await serverDb.collection('admins').doc(uid).set(normalizedAdminRecord, { merge: true });

    const adminUser = {
      uid,
      id: uid,
      name: normalizedAdminRecord.name,
      role: 'ADMIN' as const,
      email: normalizedAdminRecord.email,
    };

    const response = NextResponse.json({
      success: true,
      data: {
        user: adminUser,
        token: idToken,
      },
    });

    response.cookies.set({
      name: 'kp_admin_session',
      value: idToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.json({ success: false, error: { code: 'AUTH_FAILED', message } }, { status: 500 });
  }
}

