import { NextResponse } from 'next/server';
import { z } from 'zod';

import { handleApiError } from '@/lib/api/handle-api-error';
import { requireAdmin } from '@/lib/auth/require-admin';
import { updateUserStatus } from '@/modules/users/services/user.service';

type RouteContext = { params: Promise<{ id: string }> };
const updateSchema = z.object({ isActive: z.boolean() }).strict();

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body: unknown = await request.json();
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0]?.message ?? 'وضعیت کاربر معتبر نیست' }, { status: 400 });
    }

    const user = await updateUserStatus(id, validation.data.isActive, admin.userId);
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/admin/users/[id] error:', 'خطا در تغییر وضعیت کاربر');
  }
}
