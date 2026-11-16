import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import {
  createCategory,
  getActiveCategories,
} from "@/modules/categories/services/category.service";

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

export async function POST(request: Request) {
  try {
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

    const name =
      typeof data.name === "string" ? data.name.trim() : "";

    const slug =
      typeof data.slug === "string" ? data.slug.trim() : "";

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "نام و اسلاگ دسته‌بندی الزامی هستند",
        },
        { status: 400 },
      );
    }

    if (
      data.description !== undefined &&
      typeof data.description !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "توضیحات باید متن باشد",
        },
        { status: 400 },
      );
    }

    if (
      data.parent !== undefined &&
      data.parent !== null &&
      typeof data.parent !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه دسته‌بندی والد معتبر نیست",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const category = await createCategory({
      name,
      slug,
      ...(typeof data.description === "string"
        ? { description: data.description }
        : {}),
      ...(typeof data.parent === "string" || data.parent === null
        ? { parent: data.parent }
        : {}),
    });

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/categories error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "فرمت JSON درخواست نامعتبر است",
        },
        { status: 400 },
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "این اسلاگ قبلاً ثبت شده است",
        },
        { status: 409 },
      );
    }

    if (
      error instanceof Error &&
      (error.name === "ValidationError" || error.name === "CastError")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "اطلاعات ارسالی معتبر نیست",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ایجاد دسته‌بندی",
      },
      { status: 500 },
    );
  }
}
