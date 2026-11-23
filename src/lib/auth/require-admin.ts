import 'server-only';
import { cookies } from 'next/headers';

import { AppError } from '@/lib/errors/app-error';
import { connectToDatabase } from '@/lib/db/connect';
import { sessionCookie, verifySessionToken } from '@/lib/auth/session';
import { getPublicUserById } from '@/modules/auth/services/auth.service';

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie.name)?.value;

  if (!token) {
    throw new AppError('برای انجام این عملیات ابتدا وارد حساب مدیر شوید', 401);
  }

  const session = verifySessionToken(token);
  if (!session) {
    throw new AppError('نشست کاربری معتبر نیست یا منقضی شده است', 401);
  }

  await connectToDatabase();
  const user = await getPublicUserById(session.userId);

  // Read the current role from the database instead of trusting the role in the cookie.
  if (user.role !== 'admin' && user.role !== 'super_admin') {
    throw new AppError('شما دسترسی لازم برای انجام این عملیات را ندارید', 403);
  }

  return { userId: session.userId, user };
}
