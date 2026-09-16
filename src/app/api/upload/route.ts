import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { getServerSupabaseClient, hasSupabaseCredentials } from '@/lib/supabase/server';
import { processAndConvertToWebP } from '@/lib/media/compressor';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`upload:${ip}`, 10, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Upload rate limit exceeded. Please wait a minute.' } }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthorized) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: authResult.error || 'Admin access required for uploads.' } }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'food-items';

    if (!file) {
      return NextResponse.json({ success: false, error: { code: 'NO_FILE', message: 'No file provided.' } }, { status: 400 });
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
    } catch (validationError: unknown) {
      const msg = validationError instanceof Error ? validationError.message : 'Invalid image upload.';
      return NextResponse.json({ success: false, error: { code: 'INVALID_IMAGE', message: msg } }, { status: 400 });
    }

    const BUCKET_NAME = 'kings-platter-media';

    if (!hasSupabaseCredentials()) {
      return NextResponse.json({
        success: false,
        error: { code: 'CONFIG_ERROR', message: 'Supabase Storage credentials not configured on server.' },
      }, { status: 500 });
    }

    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: { code: 'CLIENT_ERROR', message: 'Failed to initialize Supabase Storage client.' },
      }, { status: 500 });
    }

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(processed.filename, processed.buffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({
        success: false,
        error: { code: 'STORAGE_UPLOAD_ERROR', message: `Supabase Storage upload failed: ${uploadError.message}` },
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
    const message = error instanceof Error ? error.message : 'File upload failed.';
    return NextResponse.json({ success: false, error: { code: 'UPLOAD_FAILED', message } }, { status: 500 });
  }
}

