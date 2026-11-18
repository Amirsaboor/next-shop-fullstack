import { connection } from "next/server";
import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import { sessionCookie, verifySessionToken } from "@/lib/auth/session";
import { getPublicUserById } from "@/modules/auth/services/auth.service";

export async function GET(request: NextRequest) {
  try {
    // This endpoint depends on the incoming request cookie and must not be prerendered.
    await connection();
    const token = request.cookies.get(sessionCookie.name)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "ابتدا وارد حساب کاربری شوید" },
        { status: 401 },
      );
    }

    const session = verifySessionToken(token);
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
