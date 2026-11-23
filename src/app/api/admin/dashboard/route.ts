import { connection, NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getAdminDashboardStats } from '@/modules/dashboard/services/dashboard.service';

export async function GET(request: Request) {
  // These endpoints depend on the current request's authentication cookie.
  await connection();

  // Access request data before try/catch so Next.js can bail out of prerendering.
  void request.url;

  try {
    await requireAdmin();
    await connectToDatabase();
    const stats = await getAdminDashboardStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/dashboard error:', 'خطا در دریافت آمار داشبورد');
  }
}
