import "server-only";

import { cookies } from "next/headers";

import { AppError } from "@/lib/errors/app-error";
import { connectToDatabase } from "@/lib/db/connect";
import { sessionCookie, verifySessionToken } from "@/lib/auth/session";
import { getPublicUserById } from "@/modules/auth/services/auth.service";

export async function requireUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie.name)?.value;

  if (!token) {
    throw new AppError("ابتدا وارد حساب کاربری شوید", 401);
  }

  const session = verifySessionToken(token);

  if (!session) {
    throw new AppError("نشست کاربری معتبر نیست یا منقضی شده است", 401);
  }

  await connectToDatabase();

  const user = await getPublicUserById(session.userId);

  return {
    userId: session.userId,
    user,
  };
}
