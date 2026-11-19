import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createCategorySchema } from "@/lib/validations/category.schema";
import {
  createCategory,
  getActiveCategories,
} from "@/modules/categories/services/category.service";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await getActiveCategories();

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return handleApiError(error, "GET /api/categories error:", "خطا در دریافت دسته‌بندی‌ها");
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body: unknown = await request.json();
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0]?.message ?? "اطلاعات دسته‌بندی معتبر نیست", errors: validation.error.issues },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const category = await createCategory(validation.data);

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "POST /api/categories error:", "خطا در ایجاد دسته‌بندی");
  }
}
