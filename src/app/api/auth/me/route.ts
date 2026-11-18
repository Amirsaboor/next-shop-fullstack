import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import { sessionCookie, verifySessionToken } from "@/lib/auth/session";
import { getPublicUserById } from "@/modules/auth/services/auth.service";

export async function GET(request: Request) {
  try {
    const token = request.headers
      .get("cookie")
      ?.split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${sessionCookie.name}=`))
      ?.slice(sessionCookie.name.length + 1);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "ابتدا وارد حساب کاربری شوید" },
        { status: 401 },
      );
    }

    const session = verifySessionToken(decodeURIComponent(token));
    if (!session) {
      return NextResponse.json(
        { success: false, message: "نشست کاربری معتبر نیست یا منقضی شده است" },
        { status: 401 },
      );
    }

    await connectToDatabase();
    const user = await getPublicUserById(session.userId);

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return handleApiError(error, "GET /api/auth/me error:", "خطا در دریافت اطلاعات کاربر");
  }
}
