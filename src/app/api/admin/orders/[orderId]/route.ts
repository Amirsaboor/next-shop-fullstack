import { connection, NextResponse } from 'next/server';
import { z } from 'zod';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getAdminOrderById, updateAdminOrderStatus } from '@/modules/orders/services/order.service';

type RouteContext = { params: Promise<{ orderId: string }> };
const updateSchema = z.object({
  status: z.enum(['processing', 'shipped', 'delivered', 'cancelled']),
}).strict();

export async function GET(request: Request, { params }: RouteContext) {
  // These endpoints depend on the current request's authentication cookie.
  await connection();

  // Access request data before try/catch so Next.js can bail out of prerendering.
  void request.url;

  try {
    await requireAdmin();
    const { orderId } = await params;
    await connectToDatabase();
    const order = await getAdminOrderById(orderId);
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/orders/[orderId] error:', 'خطا در دریافت سفارش');
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { orderId } = await params;
    const body: unknown = await request.json();
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0]?.message ?? 'وضعیت سفارش معتبر نیست' }, { status: 400 });
    }

    await connectToDatabase();
    const order = await updateAdminOrderStatus(orderId, validation.data.status);
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/admin/orders/[orderId] error:', 'خطا در تغییر وضعیت سفارش');
  }
}
