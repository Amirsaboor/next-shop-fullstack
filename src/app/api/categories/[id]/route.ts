import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import { requireAdmin } from "@/lib/auth/require-admin";
import { updateCategorySchema } from "@/lib/validations/category.schema";
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/modules/categories/services/category.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const category = await getCategoryById(id);
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return handleApiError(error, "GET /api/categories/[id] error:", "خطا در دریافت دسته‌بندی");
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
        { success: false, message: validation.error.issues[0]?.message ?? "اطلاعات ویرایش دسته‌بندی معتبر نیست", errors: validation.error.issues },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const category = await updateCategory(id, validation.data);
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return handleApiError(error, "PATCH /api/categories/[id] error:", "خطا در ویرایش دسته‌بندی");
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    await connectToDatabase();
    await deleteCategory(id);

    return NextResponse.json({
      success: true,
      message: "دسته‌بندی با موفقیت حذف شد",
    });
  } catch (error) {
    return handleApiError(error, "DELETE /api/categories/[id] error:", "خطا در حذف دسته‌بندی");
  }
}
