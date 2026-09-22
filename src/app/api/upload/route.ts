import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { getServerSupabaseClient, hasSupabaseCredentials } from '@/lib/supabase/server';
import { processAndConvertToWebP } from '@/lib/media/compressor';
import { mapErrorToAppError } from '@/lib/errors/appError';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`upload:${ip}`, 15, 60 * 1000);
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

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_FORM_DATA', message: 'Unable to parse uploaded file. Please select a valid image file.' },
      }, { status: 400 });
    }

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
    } catch (procErr: unknown) {
      const errMsg = procErr instanceof Error ? procErr.message : 'Please select a valid image file (JPG, PNG, WEBP).';
      return NextResponse.json({
        success: false,
        error: { code: 'INVALID_IMAGE', message: errMsg },
      }, { status: 400 });
    }

    const BUCKET_NAME = 'kings-platter-media';

    if (!hasSupabaseCredentials()) {
      console.error('[UploadAPI] Missing Supabase credentials on server environment.');
      return NextResponse.json({
        success: false,
        error: { code: 'CONFIG_ERROR', message: 'Image upload is temporarily unavailable due to server configuration.' },
      }, { status: 500 });
    }

    const supabase = getServerSupabaseClient();
    if (!supabase) {
      console.error('[UploadAPI] Failed to initialize Supabase server client.');
      return NextResponse.json({
        success: false,
        error: { code: 'CLIENT_ERROR', message: 'Image upload failed. Please try again.' },
      }, { status: 500 });
    }

    let uploadResult = await supabase.storage
      .from(BUCKET_NAME)
      .upload(processed.filename, processed.buffer, {
        contentType: processed.mimeType || 'image/webp',
        upsert: true,
      });

    if (uploadResult.error && (uploadResult.error.message?.includes('Bucket not found') || uploadResult.error.message?.includes('bucket'))) {
      console.warn(`[UploadAPI] Bucket not found fallback triggered for ${BUCKET_NAME}`);
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      }).catch((e) => console.warn('[UploadAPI] Create bucket warning:', e));

      uploadResult = await supabase.storage
        .from(BUCKET_NAME)
        .upload(processed.filename, processed.buffer, {
          contentType: processed.mimeType || 'image/webp',
          upsert: true,
        });
    }

    if (uploadResult.error) {
      console.error('[UploadAPI] Supabase storage upload error:', uploadResult.error);
      const appErr = mapErrorToAppError(uploadResult.error, 'Image upload failed. Please try again.');
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
        format: processed.filename.endsWith('.webp') ? 'webp' : 'image',
        sizeBytes: processed.sizeBytes,
      },
    });
  } catch (error: unknown) {
    console.error('[UploadAPI] Unhandled POST exception:', error);
    const appErr = mapErrorToAppError(error, 'Image upload failed. Please try again.');
    return NextResponse.json({ success: false, error: appErr }, { status: 500 });
  }
}
