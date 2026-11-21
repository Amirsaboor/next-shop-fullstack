import { connection, NextResponse } from 'next/server';
import { z } from 'zod';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getAdminUsers } from '@/modules/users/services/user.service';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().trim().max(120).optional(),
  role: z.enum(['all', 'customer', 'admin', 'super_admin']).default('all'),
  status: z.enum(['all', 'active', 'inactive']).default('all'),
}).strict();

export async function GET(request: Request) {
  // These endpoints depend on the current request's authentication cookie.
  await connection();

  // Access request data before try/catch so Next.js can bail out of prerendering.
  const { searchParams } = new URL(request.url);

  try {
    await requireAdmin();
    const validation = querySchema.safeParse(Object.fromEntries(searchParams.entries()));
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0]?.message ?? 'فیلتر کاربران معتبر نیست' }, { status: 400 });
    }

    await connectToDatabase();
    const result = await getAdminUsers(validation.data);
    return NextResponse.json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/users error:', 'خطا در دریافت کاربران');
  }
}
