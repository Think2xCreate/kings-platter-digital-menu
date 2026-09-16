import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/services/categoryService';
import { verifyAdminAuth } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { CategorySchema } from '@/lib/validation/schemas';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`category_mutate:${ip}`, 20, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again.' } }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthorized) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: authResult.error || 'Admin access required.' } }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = CategorySchema.partial().safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid category update payload', details: parseResult.error.flatten() },
      }, { status: 400 });
    }

    const updatedCategory = await categoryService.updateCategory(id, parseResult.data);
    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update category';
    return NextResponse.json({ success: false, error: { code: 'UPDATE_ERROR', message } }, { status: 500 });
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
      return NextResponse.json({ success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests.' } }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthorized) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: authResult.error || 'Admin access required.' } }, { status: 401 });
    }

    const deleteResult = await categoryService.deleteCategory(id);
    if (!deleteResult.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'DEPENDENCY_CONSTRAINT', message: deleteResult.error || 'Cannot delete category' },
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: { id } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete category';
    return NextResponse.json({ success: false, error: { code: 'DELETE_ERROR', message } }, { status: 500 });
  }
}
