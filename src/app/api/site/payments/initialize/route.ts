import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db/connect';
import { handleApiError } from '@/lib/api/handle-api-error';
import { requireUser } from '@/lib/auth/require-user';
import { initializePaymentSchema } from '@/lib/validations/payment.schema';
import { initializeOrderPayment } from '@/modules/payments/services/payment.service';

export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    await connectToDatabase();

    const body: unknown = await request.json();
    const validation = initializePaymentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0]?.message ?? 'اطلاعات شروع پرداخت معتبر نیست',
        },
        { status: 400 },
      );
    }

    const payment = await initializeOrderPayment(userId, validation.data.orderId);

    return NextResponse.json({
      success: true,
      message: 'درخواست پرداخت با موفقیت ایجاد شد',
      data: payment,
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/site/payments/initialize error:', 'خطا در شروع پرداخت');
  }
}
