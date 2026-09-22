import { NextRequest, NextResponse } from 'next/server';
import { businessService } from '@/services/businessService';
import { verifyAdminAuth } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { BusinessProfileSchema } from '@/lib/validation/schemas';
import { mapErrorToAppError } from '@/lib/errors/appError';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const profile = await businessService.getBusinessProfile();
    const response = NextResponse.json({ success: true, data: profile });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
  } catch (error: unknown) {
    const appErr = mapErrorToAppError(error, "We couldn't load business information. Please try again.");
    return NextResponse.json({ success: false, error: appErr }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`business_mutate:${ip}`, 15, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please wait a minute.' },
      }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthorized) {
      return NextResponse.json({
        success: false,
        error: { code: 'SESSION_EXPIRED', message: authResult.error || 'Your session has expired. Please sign in again.' },
      }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = BusinessProfileSchema.partial().safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]?.message || 'Please check the highlighted fields.';
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: firstIssue },
      }, { status: 400 });
    }

    const updatedProfile = await businessService.updateBusinessProfile(parseResult.data);
    return NextResponse.json({ success: true, data: updatedProfile });
  } catch (error: unknown) {
    const appErr = mapErrorToAppError(error, "We couldn't save your changes. Please try again.");
    return NextResponse.json({ success: false, error: appErr }, { status: 500 });
  }
}
