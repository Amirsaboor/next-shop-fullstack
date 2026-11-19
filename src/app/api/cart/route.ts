import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/handle-api-error";
import { getCartOwner } from "@/modules/cart/services/cart-owner.service";
import { clearCart, getCart } from "@/modules/cart/services/cart.service";

export async function GET() {
  try {
    const owner = await getCartOwner();
    const cart = await getCart(owner);

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return handleApiError(
      error,
      "GET /api/cart error:",
      "خطا در دریافت سبد خرید",
    );
  }
}

export async function DELETE() {
  try {
    const owner = await getCartOwner();
    const cart = await clearCart(owner);

    return NextResponse.json({
      success: true,
      message: "سبد خرید خالی شد",
      data: cart,
    });
  } catch (error) {
    return handleApiError(
      error,
      "DELETE /api/cart error:",
      "خطا در خالی کردن سبد خرید",
    );
  }
}
