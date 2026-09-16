import { NextRequest, NextResponse } from 'next/server';
import { foodItemService } from '@/services/foodItemService';
import { verifyAdminAuth } from '@/lib/security/auth';
import { checkRateLimit } from '@/lib/rate-limit/rate-limiter';
import { FoodItemSchema } from '@/lib/validation/schemas';

export async function GET() {
  try {
    const foodItems = await foodItemService.getAllFoodItems();
    return NextResponse.json({ success: true, data: foodItems });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch food items';
    return NextResponse.json({ success: false, error: { code: 'FETCH_ERROR', message } }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`food_mutate:${ip}`, 20, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests.' } }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthorized) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: authResult.error || 'Admin access required.' } }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = FoodItemSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid food item payload', details: parseResult.error.flatten() },
      }, { status: 400 });
    }

    const createdItem = await foodItemService.createFoodItem(parseResult.data);
    return NextResponse.json({ success: true, data: createdItem }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create food item';
    return NextResponse.json({ success: false, error: { code: 'CREATE_ERROR', message } }, { status: 500 });
  }
}
