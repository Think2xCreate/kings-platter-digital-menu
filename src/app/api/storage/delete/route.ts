import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { getServerSupabaseClient, hasSupabaseCredentials } from '@/lib/supabase/server';
import { mapErrorToAppError } from '@/lib/errors/appError';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function DELETE(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`delete_storage:${ip}`, 20, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Storage action rate limit exceeded.' } },
        { status: 429 }
      );
    }

    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthorized) {
      return NextResponse.json(
        { success: false, error: { code: 'SESSION_EXPIRED', message: authResult.error || 'Your session has expired. Please sign in again.' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const storageKey = searchParams.get('storageKey');

    if (!storageKey || typeof storageKey !== 'string' || !storageKey.trim()) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'storageKey parameter is required.' } },
        { status: 400 }
      );
    }

    const keyClean = storageKey.trim();

    // Prevent deleting core static asset placeholders
    if (
      keyClean.includes('default-fallback_image.webp') ||
      keyClean.includes('kings_platter_logo.jpg') ||
      keyClean.includes('kongu-mutton-biriyani.jpg')
    ) {
      return NextResponse.json({ success: true, data: { deleted: false, reason: 'Static asset preserved' } });
    }

    if (!hasSupabaseCredentials()) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFIG_ERROR', message: 'Storage delete is temporarily unavailable.' } },
        { status: 500 }
      );
    }

    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: { code: 'CLIENT_ERROR', message: 'Storage delete operation failed.' } },
        { status: 500 }
      );
    }

    const BUCKET_NAME = 'kings-platter-media';
    const { error: removeError } = await supabase.storage.from(BUCKET_NAME).remove([keyClean]);

    if (removeError) {
      console.warn(`Supabase object delete warning for ${keyClean}:`, removeError.message);
      return NextResponse.json({
        success: true,
        data: { deleted: false },
      });
    }

    return NextResponse.json({
      success: true,
      data: { deleted: true, path: keyClean },
    });
  } catch (error: unknown) {
    const appErr = mapErrorToAppError(error, 'Storage delete operation failed.');
    return NextResponse.json({ success: false, error: appErr }, { status: 500 });
  }
}
