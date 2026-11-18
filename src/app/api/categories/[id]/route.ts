import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
  type UpdateCategoryInput,
} from "@/modules/categories/services/category.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const category = await getCategoryById(id);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return handleApiError(
      error,
      "GET /api/categories/[id] error:",
      "خطا در دریافت دسته‌بندی",
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "بدنه درخواست معتبر نیست",
        },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;
    const updateData: UpdateCategoryInput = {};

    if (data.name !== undefined) {
      if (typeof data.name !== "string" || !data.name.trim()) {
        return NextResponse.json(
          { success: false, message: "نام دسته‌بندی معتبر نیست" },
          { status: 400 },
        );
      }
      updateData.name = data.name.trim();
    }

    if (data.slug !== undefined) {
      if (typeof data.slug !== "string" || !data.slug.trim()) {
        return NextResponse.json(
          { success: false, message: "اسلاگ دسته‌بندی معتبر نیست" },
          { status: 400 },
        );
      }
      updateData.slug = data.slug.trim();
    }

    if (data.description !== undefined) {
      if (typeof data.description !== "string") {
        return NextResponse.json(
          { success: false, message: "توضیحات باید متن باشد" },
          { status: 400 },
        );
      }
      updateData.description = data.description;
    }

    if (data.parent !== undefined) {
      if (data.parent !== null && typeof data.parent !== "string") {
        return NextResponse.json(
          { success: false, message: "شناسه دسته‌بندی والد معتبر نیست" },
          { status: 400 },
        );
      }
      updateData.parent = data.parent;
    }

    if (data.isActive !== undefined) {
      if (typeof data.isActive !== "boolean") {
        return NextResponse.json(
          { success: false, message: "وضعیت فعال بودن معتبر نیست" },
          { status: 400 },
        );
      }
      updateData.isActive = data.isActive;
    }

    if (data.sortOrder !== undefined) {
      if (
        typeof data.sortOrder !== "number" ||
        !Number.isFinite(data.sortOrder) ||
        data.sortOrder < 0
      ) {
        return NextResponse.json(
          { success: false, message: "ترتیب نمایش باید عددی نامنفی باشد" },
          { status: 400 },
        );
      }
      updateData.sortOrder = data.sortOrder;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "حداقل یک فیلد معتبر برای ویرایش ارسال کنید",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const category = await updateCategory(id, updateData);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return handleApiError(
      error,
      "PATCH /api/categories/[id] error:",
      "خطا در ویرایش دسته‌بندی",
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    await deleteCategory(id);

    return NextResponse.json({
      success: true,
      message: "دسته‌بندی با موفقیت حذف شد",
    });
  } catch (error) {
    return handleApiError(
      error,
      "DELETE /api/categories/[id] error:",
      "خطا در حذف دسته‌بندی",
    );
  }
}
