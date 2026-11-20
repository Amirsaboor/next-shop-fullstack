import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { requireAdmin } from '@/lib/auth/require-admin';
import { updateProductSchema } from '@/lib/validations/product.schema';
import {
  archiveProduct,
  getProductById,
  updateProduct,
} from '@/modules/products/services/product.service';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const product = await getProductById(id);
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleApiError(error, 'GET /api/products/[id] error:', 'خطا در دریافت محصول');
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body: unknown = await request.json();
    const validation = updateProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0]?.message ?? 'اطلاعات ویرایش محصول معتبر نیست',
          errors: validation.error.issues,
        },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const product = await updateProduct(id, validation.data);
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/products/[id] error:', 'خطا در ویرایش محصول');
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    await connectToDatabase();
    await archiveProduct(id);

    return NextResponse.json({
      success: true,
      message: 'محصول با موفقیت از فروشگاه خارج شد',
    });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/products/[id] error:', 'خطا در حذف محصول');
  }
}
