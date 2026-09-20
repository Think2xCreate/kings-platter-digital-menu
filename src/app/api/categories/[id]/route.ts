import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/services/categoryService';
import { verifyAdminAuth } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { CategorySchema } from '@/lib/validation/schemas';
import { mapErrorToAppError } from '@/lib/errors/appError';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`category_mutate:${ip}`, 20, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again.' },
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
    const parseResult = CategorySchema.partial().safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]?.message || 'Please check the highlighted fields.';
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: firstIssue },
      }, { status: 400 });
    }

    const updatedCategory = await categoryService.updateCategory(id, parseResult.data);
    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error: unknown) {
    const appErr = mapErrorToAppError(error, "We couldn't save the category. Please try again.");
    return NextResponse.json({ success: false, error: appErr }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`category_mutate:${ip}`, 20, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests.' },
      }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthorized) {
      return NextResponse.json({
        success: false,
        error: { code: 'SESSION_EXPIRED', message: authResult.error || 'Your session has expired. Please sign in again.' },
      }, { status: 401 });
    }

    const deleteResult = await categoryService.deleteCategory(id);
    if (!deleteResult.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'DEPENDENCY_CONSTRAINT', message: deleteResult.error || "We couldn't delete this category. Please try again." },
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: { id } });
  } catch (error: unknown) {
    const appErr = mapErrorToAppError(error, "We couldn't delete this category. Please try again.");
    return NextResponse.json({ success: false, error: appErr }, { status: 500 });
  }
}
