import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/handle-api-error";
import { updateCartItemSchema } from "@/lib/validations/cart.schema";
import { getCartOwner } from "@/modules/cart/services/cart-owner.service";
import {
  removeCartItem,
  updateCartItemQuantity,
} from "@/modules/cart/services/cart.service";

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const owner = await getCartOwner();
    const { itemId } = await params;
    const body: unknown = await request.json();
    const validation = updateCartItemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validation.error.issues[0]?.message ??
            "تعداد واردشده معتبر نیست",
          errors: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const cart = await updateCartItemQuantity(
      owner,
      itemId,
      validation.data.quantity,
    );

    return NextResponse.json({
      success: true,
      message: "تعداد محصول به‌روزرسانی شد",
      data: cart,
    });
  } catch (error) {
    return handleApiError(
      error,
      "PATCH /api/cart/items/[itemId] error:",
      "خطا در به‌روزرسانی سبد خرید",
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const owner = await getCartOwner();
    const { itemId } = await params;
    const cart = await removeCartItem(owner, itemId);

    return NextResponse.json({
      success: true,
      message: "محصول از سبد خرید حذف شد",
      data: cart,
    });
  } catch (error) {
    return handleApiError(
      error,
      "DELETE /api/cart/items/[itemId] error:",
      "خطا در حذف محصول از سبد خرید",
    );
  }
}
