import { connection, NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { requireAdmin } from '@/lib/auth/require-admin';
import { updateCategorySchema } from '@/lib/validations/category.schema';
import { deleteCategory, getCategoryById, updateCategory } from '@/modules/categories/services/category.service';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  // These endpoints depend on the current request's authentication cookie.
  await connection();

  // Access request data before try/catch so Next.js can bail out of prerendering.
  void request.url;

  try {
    await requireAdmin();
    const { id } = await params;
    await connectToDatabase();
    const category = await getCategoryById(id, true);
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/categories/[id] error:', 'خطا در دریافت دسته‌بندی');
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body: unknown = await request.json();
    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0]?.message ?? 'اطلاعات ویرایش دسته‌بندی معتبر نیست', errors: validation.error.issues },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const category = await updateCategory(id, validation.data);
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/admin/categories/[id] error:', 'خطا در ویرایش دسته‌بندی');
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await params;
    await connectToDatabase();
    await deleteCategory(id);
    return NextResponse.json({ success: true, message: 'دسته‌بندی با موفقیت حذف شد' });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/admin/categories/[id] error:', 'خطا در حذف دسته‌بندی');
  }
}
