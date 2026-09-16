import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/services/categoryService';
import { verifyAdminAuth } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { CategorySchema } from '@/lib/validation/schemas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const categories = await categoryService.getAllCategories(includeInactive);
    return NextResponse.json({ success: true, data: categories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
    return NextResponse.json({ success: false, error: { code: 'FETCH_ERROR', message } }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`category_mutate:${ip}`, 20, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again in a minute.' } }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthorized) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: authResult.error || 'Admin access required.' } }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = CategorySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid category data', details: parseResult.error.flatten() },
      }, { status: 400 });
    }

    const createdCategory = await categoryService.createCategory(parseResult.data);
    return NextResponse.json({ success: true, data: createdCategory }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create category';
    return NextResponse.json({ success: false, error: { code: 'CREATE_ERROR', message } }, { status: 500 });
  }
}
