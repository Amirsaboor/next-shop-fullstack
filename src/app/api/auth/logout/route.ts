import { NextResponse } from 'next/server';

import { sessionCookie } from '@/lib/auth/session';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'با موفقیت از حساب کاربری خارج شدید',
  });

  response.cookies.set(sessionCookie.name, '', {
    ...sessionCookie,
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
