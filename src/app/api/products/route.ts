import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createProductSchema, productQuerySchema } from "@/lib/validations/product.schema";
import { createProduct, getProducts } from "@/modules/products/services/product.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validation = productQuerySchema.safeParse(Object.fromEntries(searchParams.entries()));

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0]?.message ?? "فیلترهای محصولات معتبر نیستند", errors: validation.error.issues },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const result = await getProducts(validation.data);

    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error, "GET /api/products error:", "خطا در دریافت محصولات");
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body: unknown = await request.json();
    const validation = createProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0]?.message ?? "اطلاعات محصول معتبر نیست", errors: validation.error.issues },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const product = await createProduct(validation.data);

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "POST /api/products error:", "خطا در ایجاد محصول");
  }
}
