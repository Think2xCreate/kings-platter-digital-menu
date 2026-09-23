import { NextResponse } from 'next/server';
import { hasAdminCredentials, serverDb } from '@/lib/firebase/admin-firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const adminConfigured = hasAdminCredentials();
    if (!adminConfigured) {
      return NextResponse.json({
        success: false,
        firebaseAdmin: 'credentials_missing',
        firestore: 'disconnected',
      }, { status: 500 });
    }

    // Ping firestore with lightweight check
    let firestoreStatus = 'disconnected';
    try {
      await serverDb.collection('businessProfile').limit(1).get();
      firestoreStatus = 'connected';
    } catch (dbErr: unknown) {
      console.error('[HealthDiagnostic] Firestore ping error:', dbErr);
      firestoreStatus = 'error';
    }

    return NextResponse.json({
      success: firestoreStatus === 'connected',
      firebaseAdmin: 'connected',
      firestore: firestoreStatus,
    });
  } catch (error: unknown) {
    console.error('[HealthDiagnostic] Diagnostic error:', error);
    return NextResponse.json({
      success: false,
      firebaseAdmin: 'error',
      firestore: 'disconnected',
    }, { status: 500 });
  }
}
