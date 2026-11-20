import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { getProductById } from '@/modules/products/services/product.service';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const product = await getProductById(id);
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleApiError(error, 'GET /api/site/products/[id] error:', 'خطا در دریافت محصول');
  }
}
