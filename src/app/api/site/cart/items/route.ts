import { NextResponse } from 'next/server';

import { handleApiError } from '@/lib/api/site/handle-api-error';
import { addCartItemSchema } from '@/lib/validations/cart.schema';
import { getCartOwner } from '@/modules/cart/services/cart-owner.service';
import { addCartItem } from '@/modules/cart/services/cart.service';

export async function POST(request: Request) {
  try {
    const owner = await getCartOwner();
    const body: unknown = await request.json();
    const validation = addCartItemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0]?.message ?? 'اطلاعات محصول معتبر نیست',
          errors: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const cart = await addCartItem(owner, validation.data);

    return NextResponse.json(
      {
        success: true,
        message: 'محصول به سبد خرید اضافه شد',
        data: cart,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, 'POST /api/site/cart/items error:', 'خطا در افزودن محصول به سبد خرید');
  }
}
