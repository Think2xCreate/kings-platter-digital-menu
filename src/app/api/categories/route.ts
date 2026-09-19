import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/services/categoryService';
import { verifyAdminAuth } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { CategorySchema } from '@/lib/validation/schemas';
import { mapErrorToAppError } from '@/lib/errors/appError';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const categories = await categoryService.getAllCategories(includeInactive);
    return NextResponse.json({ success: true, data: categories });
  } catch (error: unknown) {
    const appErr = mapErrorToAppError(error, "We couldn't load categories. Please try again.");
    return NextResponse.json({ success: false, error: appErr }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`category_mutate:${ip}`, 20, 60 * 1000);
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
    const parseResult = CategorySchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]?.message || 'Please check the highlighted fields.';
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: firstIssue },
      }, { status: 400 });
    }

    const createdCategory = await categoryService.createCategory(parseResult.data);
    return NextResponse.json({ success: true, data: createdCategory }, { status: 201 });
  } catch (error: unknown) {
    const appErr = mapErrorToAppError(error, "We couldn't save the category. Please try again.");
    return NextResponse.json({ success: false, error: appErr }, { status: 500 });
  }
}
