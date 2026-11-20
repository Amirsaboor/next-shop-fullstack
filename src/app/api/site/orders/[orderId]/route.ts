import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/site/handle-api-error';
import { requireUser } from '@/lib/auth/require-user';
import { getUserOrderById } from '@/modules/orders/services/order.service';

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { userId } = await requireUser();
    await connectToDatabase();

    const { orderId } = await params;
    const order = await getUserOrderById(userId, orderId);

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/site/orders/[orderId] error:', 'خطا در دریافت سفارش');
  }
}
