import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { getServerSupabaseClient, hasSupabaseCredentials } from '@/lib/supabase/server';
import { processAndConvertToWebP } from '@/lib/media/compressor';
import { mapErrorToAppError } from '@/lib/errors/appError';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`upload:${ip}`, 10, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Upload rate limit exceeded. Please wait a minute.' },
      }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthorized) {
      return NextResponse.json({
        success: false,
        error: { code: 'SESSION_EXPIRED', message: authResult.error || 'Your session has expired. Please sign in again.' },
      }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'food-items';

    if (!file) {
      return NextResponse.json({
        success: false,
        error: { code: 'NO_FILE', message: 'Please select an image file.' },
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    let processed;
    try {
      processed = await processAndConvertToWebP({
        buffer: rawBuffer,
        mimeType: file.type || 'image/jpeg',
        originalName: file.name,
        folder,
      });
    } catch {
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_IMAGE', message: 'Please select a valid image file (JPG, PNG, WEBP).' },
      }, { status: 400 });
    }

    const BUCKET_NAME = 'kings-platter-media';

    if (!hasSupabaseCredentials()) {
      return NextResponse.json({
        success: false,
        error: { code: 'CONFIG_ERROR', message: 'Image upload is temporarily unavailable.' },
      }, { status: 500 });
    }

    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: { code: 'CLIENT_ERROR', message: 'Image upload failed. Please try again.' },
      }, { status: 500 });
    }

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(processed.filename, processed.buffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      const appErr = mapErrorToAppError(uploadError, 'Image upload failed. Please try again.');
      return NextResponse.json({
        success: false,
        error: { code: 'UPLOAD_ERROR', message: appErr.message },
      }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(processed.filename);

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrlData.publicUrl,
        path: processed.filename,
        format: 'webp',
        sizeBytes: processed.sizeBytes,
      },
    });
  } catch (error: unknown) {
    const appErr = mapErrorToAppError(error, 'Image upload failed. Please try again.');
    return NextResponse.json({ success: false, error: appErr }, { status: 500 });
  }
}
