import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { getActiveCategories } from '@/modules/categories/services/category.service';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await getActiveCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return handleApiError(error, 'GET /api/site/categories error:', 'خطا در دریافت دسته‌بندی‌ها');
  }
}
