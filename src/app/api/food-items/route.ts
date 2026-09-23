import { NextRequest, NextResponse } from 'next/server';
import { foodItemService } from '@/services/foodItemService';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { FoodItemSchema } from '@/lib/validation/schemas';
import { normalizeYouTubeVideoUrl } from '@/utils/imageResolver';
import { mapErrorToAppError } from '@/lib/errors/appError';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const foodItems = await foodItemService.getAllFoodItems();
    const response = NextResponse.json({ success: true, data: foodItems });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
  } catch (error: unknown) {
    const appErr = mapErrorToAppError(error, "We couldn't load food items. Please try again.");
    return NextResponse.json({ success: false, error: appErr }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`food_mutate:${ip}`, 20, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please wait a minute.' },
      }, { status: 429 });
    }

    const { verifyAdminAuth } = await import('@/lib/security/auth');
    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthorized) {
      return NextResponse.json({
        success: false,
        error: { code: 'SESSION_EXPIRED', message: authResult.error || 'Your session has expired. Please sign in again.' },
      }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = FoodItemSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]?.message || 'Please check the highlighted fields.';
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: firstIssue },
      }, { status: 400 });
    }

    const payload = parseResult.data;
    const rawVideoUrl = payload.youtubeVideoUrl || payload.videoUrl;

    if (rawVideoUrl && rawVideoUrl.trim() !== '') {
      const norm = normalizeYouTubeVideoUrl(rawVideoUrl);
      if (!norm.isValid) {
        return NextResponse.json({
          success: false,
          error: { code: 'INVALID_YOUTUBE_URL', message: norm.error || 'Please enter a valid YouTube video URL.' },
        }, { status: 400 });
      }
      payload.youtubeVideoId = norm.videoId;
      payload.youtubeVideoUrl = norm.normalizedUrl;
    } else {
      payload.youtubeVideoId = null;
      payload.youtubeVideoUrl = null;
    }

    const createdItem = await foodItemService.createFoodItem(payload);
    return NextResponse.json({ success: true, data: createdItem }, { status: 201 });
  } catch (error: unknown) {
    const appErr = mapErrorToAppError(error, "We couldn't save the food item. Please try again.");
    return NextResponse.json({ success: false, error: appErr }, { status: 500 });
  }
}
