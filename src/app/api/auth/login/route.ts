import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import { createSessionToken, sessionCookie } from "@/lib/auth/session";
import { loginUser } from "@/modules/auth/services/auth.service";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      !isRecord(body) ||
      typeof body.identifier !== "string" ||
      !body.identifier.trim() ||
      typeof body.password !== "string" ||
      !body.password
    ) {
      return NextResponse.json(
        { success: false, message: "نام کاربری یا ایمیل و رمز عبور الزامی هستند" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const user = await loginUser({
      identifier: body.identifier,
      password: body.password,
    });

    const response = NextResponse.json({
      success: true,
      message: "ورود با موفقیت انجام شد",
      data: user,
    });

    response.cookies.set(
      sessionCookie.name,
      createSessionToken(user.id, user.role),
      sessionCookie,
    );

    return response;
  } catch (error) {
    return handleApiError(error, "POST /api/auth/login error:", "خطا در ورود به حساب");
  }
}
