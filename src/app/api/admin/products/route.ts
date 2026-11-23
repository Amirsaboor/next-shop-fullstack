import { connection, NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { requireAdmin } from '@/lib/auth/require-admin';
import { adminProductQuerySchema, createProductSchema } from '@/lib/validations/product.schema';
import { createProduct, getProducts } from '@/modules/products/services/product.service';

export async function GET(request: Request) {
  // These endpoints depend on the current request's authentication cookie.
  await connection();

  // Access request data before try/catch so Next.js can bail out of prerendering.
  const { searchParams } = new URL(request.url);

  try {
    await requireAdmin();
    const validation = adminProductQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0]?.message ?? 'فیلترهای محصولات معتبر نیستند', errors: validation.error.issues },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const { status, ...filters } = validation.data;
    const result = await getProducts({
      ...filters,
      includeInactive: status === 'all',
      isActive: status === 'active' ? true : status === 'inactive' ? false : undefined,
    });

    return NextResponse.json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/products error:', 'خطا در دریافت محصولات مدیریتی');
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body: unknown = await request.json();
    const validation = createProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0]?.message ?? 'اطلاعات محصول معتبر نیست', errors: validation.error.issues },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const product = await createProduct(validation.data);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/admin/products error:', 'خطا در ایجاد محصول');
  }
}
