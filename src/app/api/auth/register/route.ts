import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { assertSessionConfig, createSessionToken, sessionCookie } from '@/lib/auth/session';
import { registerSchema } from '@/lib/validations/auth.schema';
import { registerUser } from '@/modules/auth/services/auth.service';

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0]?.message ?? 'اطلاعات ثبت‌نام معتبر نیست',
          errors: validation.error.issues,
        },
        { status: 400 },
      );
    }

    assertSessionConfig();
    await connectToDatabase();
    const user = await registerUser(validation.data);

    const response = NextResponse.json(
      { success: true, message: 'ثبت‌نام با موفقیت انجام شد', data: user },
      { status: 201 },
    );

    response.cookies.set(sessionCookie.name, createSessionToken(user.id, user.role), sessionCookie);

    return response;
  } catch (error) {
    return handleApiError(error, 'POST /api/auth/register error:', 'خطا در ثبت‌نام');
  }
}
