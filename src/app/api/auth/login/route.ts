import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import { assertSessionConfig, createSessionToken, sessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth.schema";
import { loginUser } from "@/modules/auth/services/auth.service";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0]?.message ?? "اطلاعات ورود معتبر نیست", errors: validation.error.issues },
        { status: 400 },
      );
    }

    assertSessionConfig();
    await connectToDatabase();
    const user = await loginUser(validation.data);

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
