import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { productQuerySchema } from '@/lib/validations/product.schema';
import { getProducts } from '@/modules/products/services/product.service';

export async function GET(request: Request) {
  // Read request-time URL data before the catch block so Next.js can bail out of prerendering.
  const { searchParams } = new URL(request.url);

  try {
    const validation = productQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0]?.message ?? 'فیلترهای محصولات معتبر نیستند', errors: validation.error.issues },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const result = await getProducts(validation.data);

    return NextResponse.json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    return handleApiError(error, 'GET /api/site/products error:', 'خطا در دریافت محصولات');
  }
}
