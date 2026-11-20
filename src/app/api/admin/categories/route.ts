import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createCategorySchema } from '@/lib/validations/category.schema';
import { createCategory, getAllCategories } from '@/modules/categories/services/category.service';

export async function GET(request: Request) {
  // Access request data before try/catch so Next.js can bail out of prerendering.
  const { searchParams } = new URL(request.url);

  try {
    await requireAdmin();
    const status = searchParams.get('status') ?? 'all';
    const parent = searchParams.get('parent');

    if (!['all', 'active', 'inactive'].includes(status)) {
      return NextResponse.json({ success: false, message: 'وضعیت دسته‌بندی معتبر نیست' }, { status: 400 });
    }

    await connectToDatabase();
    let categories = await getAllCategories();

    if (status !== 'all') categories = categories.filter((category) => category.isActive === (status === 'active'));
    if (parent === 'root') categories = categories.filter((category) => !category.parent);
    else if (parent) categories = categories.filter((category) => String(category.parent) === parent);

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/categories error:', 'خطا در دریافت دسته‌بندی‌های مدیریتی');
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body: unknown = await request.json();
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0]?.message ?? 'اطلاعات دسته‌بندی معتبر نیست', errors: validation.error.issues },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const category = await createCategory(validation.data);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/admin/categories error:', 'خطا در ایجاد دسته‌بندی');
  }
}
