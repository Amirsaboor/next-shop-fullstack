import { NextResponse } from "next/server";

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

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const product = await getProductById(id);
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleApiError(error, "GET /api/products/[id] error:", "خطا در دریافت محصول");
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const body: unknown = await request.json();

    if (!isRecord(body)) {
      return NextResponse.json(
        { success: false, message: "بدنه درخواست معتبر نیست" },
        { status: 400 },
      );
    }

    const updateData: UpdateProductInput = {};
    const stringFields = ["name", "slug", "description", "summary", "category", "brand"] as const;

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "string" || !body[field].trim()) {
          return NextResponse.json(
            { success: false, message: "یکی از فیلدهای متنی محصول معتبر نیست" },
            { status: 400 },
          );
        }
        updateData[field] = body[field].trim();
      }
    }

    if (body.price !== undefined) {
      if (typeof body.price !== "number" || !Number.isFinite(body.price)) {
        return NextResponse.json(
          { success: false, message: "قیمت محصول معتبر نیست" },
          { status: 400 },
        );
      }
      updateData.price = body.price;
    }

    if (body.compareAtPrice !== undefined) {
      if (
        body.compareAtPrice !== null &&
        (typeof body.compareAtPrice !== "number" || !Number.isFinite(body.compareAtPrice))
      ) {
        return NextResponse.json(
          { success: false, message: "قیمت قبل از تخفیف معتبر نیست" },
          { status: 400 },
        );
      }
      updateData.compareAtPrice = body.compareAtPrice;
    }

    if (body.stock !== undefined) {
      if (typeof body.stock !== "number" || !Number.isInteger(body.stock)) {
        return NextResponse.json(
          { success: false, message: "موجودی محصول باید عدد صحیح باشد" },
          { status: 400 },
        );
      }
      updateData.stock = body.stock;
    }

    for (const field of ["hasVariants", "isFeatured", "isActive"] as const) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "boolean") {
          return NextResponse.json(
            { success: false, message: "یکی از وضعیت‌های محصول معتبر نیست" },
            { status: 400 },
          );
        }
        updateData[field] = body[field];
      }
    }

    if (body.sortOrder !== undefined) {
      if (typeof body.sortOrder !== "number" || !Number.isFinite(body.sortOrder) || body.sortOrder < 0) {
        return NextResponse.json(
          { success: false, message: "ترتیب نمایش معتبر نیست" },
          { status: 400 },
        );
      }
      updateData.sortOrder = body.sortOrder;
    }

    for (const field of ["images", "specifications", "variants", "tags"] as const) {
      if (body[field] !== undefined) {
        if (!Array.isArray(body[field])) {
          return NextResponse.json(
            { success: false, message: "یکی از فهرست‌های محصول معتبر نیست" },
            { status: 400 },
          );
        }
        (updateData as Record<string, unknown>)[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "حداقل یک فیلد برای ویرایش ارسال کنید" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const product = await updateProduct(id, updateData);

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleApiError(error, "PATCH /api/products/[id] error:", "خطا در ویرایش محصول");
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
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
