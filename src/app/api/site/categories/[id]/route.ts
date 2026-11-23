import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { getCategoryById } from '@/modules/categories/services/category.service';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const category = await getCategoryById(id);
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return handleApiError(error, 'GET /api/site/categories/[id] error:', 'خطا در دریافت دسته‌بندی');
  }
}
