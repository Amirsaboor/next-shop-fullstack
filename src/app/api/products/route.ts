import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import {
  createProduct,
  getProducts,
  type CreateProductInput,
  type GetProductsOptions,
} from "@/modules/products/services/product.service";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function parseProductInput(data: Record<string, unknown>): CreateProductInput | null {
  if (
    typeof data.name !== "string" ||
    !data.name.trim() ||
    typeof data.slug !== "string" ||
    !data.slug.trim() ||
    typeof data.category !== "string" ||
    typeof data.price !== "number" ||
    !Number.isFinite(data.price)
  ) {
    return null;
  }

  if (
    (data.description !== undefined && typeof data.description !== "string") ||
    (data.summary !== undefined && typeof data.summary !== "string") ||
    (data.brand !== undefined && typeof data.brand !== "string") ||
    (data.stock !== undefined && typeof data.stock !== "number") ||
    (data.compareAtPrice !== undefined &&
      data.compareAtPrice !== null &&
      typeof data.compareAtPrice !== "number") ||
    (data.hasVariants !== undefined && typeof data.hasVariants !== "boolean") ||
    (data.isFeatured !== undefined && typeof data.isFeatured !== "boolean") ||
    (data.sortOrder !== undefined && typeof data.sortOrder !== "number") ||
    (data.tags !== undefined && !isStringArray(data.tags)) ||
    (data.images !== undefined && !Array.isArray(data.images)) ||
    (data.specifications !== undefined && !Array.isArray(data.specifications)) ||
    (data.variants !== undefined && !Array.isArray(data.variants))
  ) {
    return null;
  }

  return data as unknown as CreateProductInput;
}

function parseOptionalNumber(value: string | null, field: string) {
  if (value === null) return undefined;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`پارامتر ${field} معتبر نیست`);
  }
  return number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortValue = searchParams.get("sort");
    const allowedSorts = ["newest", "oldest", "price-asc", "price-desc", "name"] as const;

    if (sortValue && !allowedSorts.includes(sortValue as (typeof allowedSorts)[number])) {
      return NextResponse.json(
        { success: false, message: "مرتب‌سازی انتخاب‌شده معتبر نیست" },
        { status: 400 },
      );
    }

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 12);
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, message: "شماره صفحه یا تعداد نتایج معتبر نیست" },
        { status: 400 },
      );
    }

    const featuredValue = searchParams.get("featured");
    if (featuredValue !== null && featuredValue !== "true" && featuredValue !== "false") {
      return NextResponse.json(
        { success: false, message: "فیلتر محصولات ویژه معتبر نیست" },
        { status: 400 },
      );
    }

    const options: GetProductsOptions = {
      page,
      limit,
      ...(searchParams.get("category") ? { category: searchParams.get("category")! } : {}),
      ...(searchParams.get("search") ? { search: searchParams.get("search")! } : {}),
      ...(searchParams.get("sort") ? { sort: sortValue as GetProductsOptions["sort"] } : {}),
      ...(featuredValue !== null ? { featured: featuredValue === "true" } : {}),
      ...(parseOptionalNumber(searchParams.get("minPrice"), "minPrice") !== undefined
        ? { minPrice: parseOptionalNumber(searchParams.get("minPrice"), "minPrice") }
        : {}),
      ...(parseOptionalNumber(searchParams.get("maxPrice"), "maxPrice") !== undefined
        ? { maxPrice: parseOptionalNumber(searchParams.get("maxPrice"), "maxPrice") }
        : {}),
    };

    if (
      options.minPrice !== undefined &&
      options.maxPrice !== undefined &&
      options.minPrice > options.maxPrice
    ) {
      return NextResponse.json(
        { success: false, message: "حداقل قیمت نمی‌تواند بیشتر از حداکثر قیمت باشد" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const result = await getProducts(options);

    return NextResponse.json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    return handleApiError(error, "GET /api/products error:", "خطا در دریافت محصولات");
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!isRecord(body)) {
      return NextResponse.json(
        { success: false, message: "بدنه درخواست معتبر نیست" },
        { status: 400 },
      );
    }

    const input = parseProductInput(body);
    if (!input) {
      return NextResponse.json(
        { success: false, message: "اطلاعات ضروری محصول یا نوع فیلدهای ارسالی معتبر نیست" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const product = await createProduct(input);

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error, "POST /api/products error:", "خطا در ایجاد محصول");
  }
}
