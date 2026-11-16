import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import { getActiveCategories } from "@/modules/categories/services/category.service";

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await getActiveCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت دسته‌بندی‌ها",
      },
      { status: 500 },
    );
  }
}
