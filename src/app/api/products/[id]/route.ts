import { NextResponse } from "next/server";

import { AppError } from "@/lib/errors/app-error";
import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import {
  archiveProduct,
  getProductById,
  updateProduct,
  type UpdateProductInput,
} from "@/modules/products/services/product.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const product = await getProductById(id);
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleApiError(error, "GET /api/products/[id] error:", "خطا در دریافت محصول");
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body: unknown = await request.json();

    if (!isRecord(body)) throw new AppError("بدنه درخواست معتبر نیست", 400);

    const updateData: UpdateProductInput = {};
    const requiredTextFields = ["name", "slug", "category"] as const;
    const optionalTextFields = ["description", "summary", "brand"] as const;

    for (const field of requiredTextFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "string" || !body[field].trim()) {
          throw new AppError("نام، اسلاگ و دسته‌بندی محصول باید معتبر باشند", 400);
        }
        updateData[field] = body[field].trim();
      }
    }

    for (const field of optionalTextFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "string") throw new AppError("فیلد متنی محصول معتبر نیست", 400);
        updateData[field] = body[field];
      }
    }

    if (body.price !== undefined) {
      if (typeof body.price !== "number" || !Number.isFinite(body.price)) {
        throw new AppError("قیمت محصول معتبر نیست", 400);
      }
      updateData.price = body.price;
    }

    if (body.compareAtPrice !== undefined) {
      if (body.compareAtPrice !== null && (typeof body.compareAtPrice !== "number" || !Number.isFinite(body.compareAtPrice))) {
        throw new AppError("قیمت قبل از تخفیف معتبر نیست", 400);
      }
      updateData.compareAtPrice = body.compareAtPrice;
    }

    if (body.stock !== undefined) {
      if (typeof body.stock !== "number" || !Number.isInteger(body.stock)) {
        throw new AppError("موجودی محصول باید عدد صحیح باشد", 400);
      }
      updateData.stock = body.stock;
    }

    for (const field of ["hasVariants", "isFeatured", "isActive"] as const) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "boolean") throw new AppError("وضعیت محصول معتبر نیست", 400);
        updateData[field] = body[field];
      }
    }

    if (body.sortOrder !== undefined) {
      if (typeof body.sortOrder !== "number" || !Number.isFinite(body.sortOrder) || body.sortOrder < 0) {
        throw new AppError("ترتیب نمایش معتبر نیست", 400);
      }
      updateData.sortOrder = body.sortOrder;
    }

    for (const field of ["images", "specifications", "variants", "tags"] as const) {
      if (body[field] !== undefined) {
        if (!Array.isArray(body[field])) throw new AppError("یکی از فهرست‌های محصول معتبر نیست", 400);
        (updateData as Record<string, unknown>)[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError("حداقل یک فیلد برای ویرایش ارسال کنید", 400);
    }

    await connectToDatabase();
    const product = await updateProduct(id, updateData);
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleApiError(error, "PATCH /api/products/[id] error:", "خطا در ویرایش محصول");
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectToDatabase();
    await archiveProduct(id);

    return NextResponse.json({
      success: true,
      message: "محصول با موفقیت از فروشگاه خارج شد",
    });
  } catch (error) {
    return handleApiError(error, "DELETE /api/products/[id] error:", "خطا در حذف محصول");
  }
}
