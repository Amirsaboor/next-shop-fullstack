import "server-only";

import mongoose from "mongoose";

import { AppError } from "@/lib/errors/app-error";
import Cart from "@/modules/cart/models/cart.model";
import Product from "@/modules/products/models/product.model";
import type { CartOwner } from "@/modules/cart/services/cart-owner.service";
import type { AddCartItemInput } from "@/lib/validations/cart.schema";

type CartItemDocument = {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  variantId: string | null;
  quantity: number;
};

type ProductImage = { url: string; isPrimary: boolean };

type ProductVariant = {
  _id: mongoose.Types.ObjectId;
  isActive: boolean;
  stock: number;
  price: number;
  compareAtPrice?: number | null;
  name: string;
  sku: string;
  attributes: Array<{ name: string; value: string }>;
};

type CartProduct = {
  _id: mongoose.Types.ObjectId;
  hasVariants: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  productCode: string;
  name: string;
  slug: string;
  stock: number;
  price: number;
  compareAtPrice?: number | null;
};

function ownerFilter(owner: CartOwner) {
  return "userId" in owner
    ? { user: owner.userId }
    : { guestId: owner.guestId };
}

async function findOrCreateCart(owner: CartOwner) {
  const filter = ownerFilter(owner);
  let cart = await Cart.findOne(filter);

  if (!cart) {
    try {
      cart = await Cart.create({
        ...filter,
        items: [],
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        cart = await Cart.findOne(filter);
      } else {
        throw error;
      }
    }
  }

  if (!cart) throw new AppError("ساخت سبد خرید انجام نشد", 500);
  return cart;
}

async function getProductPricing(productId: string, variantId?: string | null) {
  const product = (await Product.findOne({
    _id: productId,
    isActive: true,
  }).lean()) as CartProduct | null;

  if (!product) throw new AppError("محصول پیدا نشد یا غیرفعال است", 404);

  if (product.hasVariants) {
    if (!variantId) {
      throw new AppError("لطفاً تنوع موردنظر محصول را انتخاب کنید", 400);
    }

    const variant = product.variants.find(
      (item) => item._id.toString() === variantId && item.isActive,
    );

    if (!variant) throw new AppError("تنوع انتخاب‌شده موجود نیست", 404);

    return {
      product,
      stock: variant.stock,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice ?? null,
    };
  }

  if (variantId) {
    throw new AppError("این محصول تنوع قابل انتخاب ندارد", 400);
  }

  return {
    product,
    stock: product.stock,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
  };
}

export async function getCart(owner: CartOwner) {
  const cart = await findOrCreateCart(owner);
  const items = await Promise.all(
    (cart.items as unknown as CartItemDocument[]).map(async (item) => {
      try {
        const pricing = await getProductPricing(
          item.product.toString(),
          item.variantId,
        );
        const variant = pricing.product.hasVariants
          ? pricing.product.variants.find(
              (entry) => entry._id.toString() === item.variantId,
            )
          : null;

        return {
          id: item._id.toString(),
          productId: pricing.product._id.toString(),
          productCode: pricing.product.productCode,
          name: pricing.product.name,
          slug: pricing.product.slug,
          image: pricing.product.images.find((image) => image.isPrimary)?.url ??
            pricing.product.images[0]?.url ??
            null,
          variant: variant
            ? {
                id: variant._id.toString(),
                name: variant.name,
                sku: variant.sku,
                attributes: variant.attributes,
              }
            : null,
          quantity: item.quantity,
          unitPrice: pricing.price,
          compareAtPrice: pricing.compareAtPrice,
          stock: pricing.stock,
          isAvailable: pricing.stock >= item.quantity,
          lineTotal: pricing.price * item.quantity,
        };
      } catch (error) {
        if (!(error instanceof AppError) || error.statusCode !== 404) {
          throw error;
        }

        return {
          id: item._id.toString(),
          productId: item.product.toString(),
          quantity: item.quantity,
          unitPrice: 0,
          compareAtPrice: null,
          stock: 0,
          isAvailable: false,
          lineTotal: 0,
        };
      }
    }),
  );

  const availableItems = items.filter((item) => item.isAvailable);
  const subtotal = availableItems.reduce(
    (total, item) => total + item.lineTotal,
    0,
  );

  return {
    items,
    summary: {
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal,
      unavailableCount: items.length - availableItems.length,
    },
  };
}

export async function addCartItem(
  owner: CartOwner,
  input: AddCartItemInput,
) {
  const pricing = await getProductPricing(input.productId, input.variantId);
  if (pricing.stock < 1) {
    throw new AppError("این محصول در حال حاضر موجود نیست", 409);
  }

  const cart = await findOrCreateCart(owner);
  const existingItem = cart.items.find(
    (item: CartItemDocument) =>
      item.product.toString() === input.productId &&
      (item.variantId ?? null) === (input.variantId ?? null),
  );

  const nextQuantity = (existingItem?.quantity ?? 0) + input.quantity;

  if (nextQuantity > pricing.stock) {
    throw new AppError(
      `حداکثر تعداد قابل سفارش از این محصول ${pricing.stock} عدد است`,
      409,
    );
  }

  if (existingItem) {
    existingItem.quantity = nextQuantity;
  } else {
    cart.items.push({
      product: new mongoose.Types.ObjectId(input.productId),
      variantId: input.variantId ?? null,
      quantity: input.quantity,
    });
  }

  await cart.save();
  return getCart(owner);
}

export async function updateCartItemQuantity(
  owner: CartOwner,
  itemId: string,
  quantity: number,
) {
  if (!mongoose.isObjectIdOrHexString(itemId)) {
    throw new AppError("شناسه آیتم سبد خرید معتبر نیست", 400);
  }

  const cart = await findOrCreateCart(owner);
  const item = cart.items.find(
    (entry: CartItemDocument) => entry._id.toString() === itemId,
  );

  if (!item) throw new AppError("آیتم موردنظر در سبد خرید پیدا نشد", 404);

  const pricing = await getProductPricing(
    item.product.toString(),
    item.variantId,
  );

  if (quantity > pricing.stock) {
    throw new AppError(
      `حداکثر تعداد قابل سفارش از این محصول ${pricing.stock} عدد است`,
      409,
    );
  }

  item.quantity = quantity;
  await cart.save();
  return getCart(owner);
}

export async function removeCartItem(owner: CartOwner, itemId: string) {
  if (!mongoose.isObjectIdOrHexString(itemId)) {
    throw new AppError("شناسه آیتم سبد خرید معتبر نیست", 400);
  }

  const cart = await findOrCreateCart(owner);
  const item = cart.items.find(
    (entry: CartItemDocument) => entry._id.toString() === itemId,
  );

  if (!item) throw new AppError("آیتم موردنظر در سبد خرید پیدا نشد", 404);

  cart.items.pull({ _id: itemId });
  await cart.save();
  return getCart(owner);
}

export async function clearCart(owner: CartOwner) {
  await Cart.updateOne(ownerFilter(owner), { $set: { items: [] } });
  return getCart(owner);
}

export async function mergeGuestCart(guestId: string, userId: string) {
  const guestCart = await Cart.findOne({ guestId });
  if (!guestCart) return;

  const userOwner: CartOwner = { userId };

  for (const item of guestCart.items as unknown as CartItemDocument[]) {
    try {
      await addCartItem(userOwner, {
        productId: item.product.toString(),
        ...(item.variantId ? { variantId: item.variantId } : {}),
        quantity: item.quantity,
      });
    } catch {
      // Skip guest items that became unavailable or exceed current stock.
    }
  }

  await guestCart.deleteOne();
}
