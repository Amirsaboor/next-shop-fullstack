import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import { createSessionToken, sessionCookie } from "@/lib/auth/session";
import { registerUser } from "@/modules/auth/services/auth.service";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

    const fields = ["firstName", "lastName", "username", "mobile", "email", "password"] as const;
    for (const field of fields) {
      if (typeof body[field] !== "string" || !body[field].trim()) {
        return NextResponse.json(
          { success: false, message: "تمام فیلدهای ثبت‌نام الزامی هستند" },
          { status: 400 },
        );
      }
    }

    await connectToDatabase();

    const user = await registerUser({
      firstName: body.firstName as string,
      lastName: body.lastName as string,
      username: body.username as string,
      mobile: body.mobile as string,
      email: body.email as string,
      password: body.password as string,
    });

    const response = NextResponse.json(
      { success: true, message: "ثبت‌نام با موفقیت انجام شد", data: user },
      { status: 201 },
    );

    response.cookies.set(
      sessionCookie.name,
      createSessionToken(user.id, user.role),
      sessionCookie,
    );

    return response;
  } catch (error) {
    return handleApiError(error, "POST /api/auth/register error:", "خطا در ثبت‌نام");
  }
}
