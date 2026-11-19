import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";

import { connectToDatabase } from "@/lib/db/connect";
import { handleApiError } from "@/lib/api/handle-api-error";
import { sessionCookie, verifySessionToken } from "@/lib/auth/session";
import { getPublicUserById } from "@/modules/auth/services/auth.service";

export async function GET() {
  try {
    // Reading the async cookies API makes this request-specific Route Handler dynamic.
    const cookieStore = await cookies();
    const token = cookieStore.get(sessionCookie.name)?.value;

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
    // Let Next.js handle its own prerender/request-time control-flow errors.
    unstable_rethrow(error);
    return handleApiError(error, "GET /api/auth/me error:", "خطا در دریافت اطلاعات کاربر");
  }
}
