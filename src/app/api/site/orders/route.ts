import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import { requireUser } from "@/lib/auth/require-user";
import {
  createOrderSchema,
  orderQuerySchema,
} from "@/lib/validations/order.schema";
import {
  createOrder,
  getUserOrders,
} from "@/modules/orders/services/order.service";

export async function GET(request: Request) {
  try {
    const { userId } = await requireUser();
    await connectToDatabase();

    const url = new URL(request.url);
    const validation = orderQuerySchema.safeParse({
      page: url.searchParams.get("page") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0]?.message ?? "فیلتر سفارش‌ها معتبر نیست",
        },
        { status: 400 },
      );
    }

    const result = await getUserOrders(
      userId,
      validation.data.page,
      validation.data.limit,
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(
      error,
      "GET /api/site/orders error:",
      "خطا در دریافت سفارش‌ها",
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    await connectToDatabase();

    const body: unknown = await request.json();
    const validation = createOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0]?.message ?? "اطلاعات سفارش معتبر نیست",
          errors: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const order = await createOrder(userId, validation.data);

    return NextResponse.json(
      {
        success: true,
        message: "سفارش با موفقیت ثبت شد",
        data: order,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "POST /api/site/orders error:",
      "خطا در ثبت سفارش",
    );
  }
}
