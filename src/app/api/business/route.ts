import { NextRequest, NextResponse } from 'next/server';
import { businessService } from '@/services/businessService';
import { verifyAdminAuth } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { BusinessProfileSchema } from '@/lib/validation/schemas';

export async function GET() {
  try {
    const profile = await businessService.getBusinessProfile();
    return NextResponse.json({ success: true, data: profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch business profile';
    return NextResponse.json({ success: false, error: { code: 'FETCH_ERROR', message } }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`business_mutate:${ip}`, 15, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests.' } }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthorized) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: authResult.error || 'Admin access required.' } }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = BusinessProfileSchema.partial().safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid profile payload', details: parseResult.error.flatten() },
      }, { status: 400 });
    }

    const updatedProfile = await businessService.updateBusinessProfile(parseResult.data);
    return NextResponse.json({ success: true, data: updatedProfile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update business profile';
    return NextResponse.json({ success: false, error: { code: 'UPDATE_ERROR', message } }, { status: 500 });
  }
}
