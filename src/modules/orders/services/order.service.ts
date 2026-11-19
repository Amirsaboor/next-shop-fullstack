import "server-only";

import { randomBytes } from "node:crypto";
import mongoose from "mongoose";

import { AppError } from "@/lib/errors/app-error";
import Address from "@/modules/addresses/models/address.model";
import Cart from "@/modules/cart/models/cart.model";
import Order from "@/modules/orders/models/order.model";
import Product from "@/modules/products/models/product.model";
import type { CreateOrderInput } from "@/lib/validations/order.schema";

type OrderProductImage = { url: string; isPrimary: boolean };

type OrderProductVariant = {
  _id: mongoose.Types.ObjectId;
  isActive: boolean;
  stock: number;
  price: number;
  compareAtPrice?: number | null;
  name: string;
  sku: string;
  attributes: Array<{ name: string; value: string }>;
};

type OrderProduct = {
  _id: mongoose.Types.ObjectId;
  productCode: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  hasVariants: boolean;
  variants: OrderProductVariant[];
  images: OrderProductImage[];
};

function createOrderNumber() {
  const date = new Date();
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  return `ORD-${datePart}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function createOrder(
  userId: string,
  input: CreateOrderInput,
) {
  const session = await mongoose.startSession();
  const orderNumber = createOrderNumber();
  let createdOrderId: mongoose.Types.ObjectId | null = null;

  try {
    await session.withTransaction(async () => {
      const [cart, address] = await Promise.all([
        Cart.findOne({ user: userId }).session(session),
        Address.findOne({
          _id: input.addressId,
          user: userId,
        }).session(session),
      ]);

      if (!address) {
        throw new AppError("آدرس انتخاب‌شده پیدا نشد", 404);
      }

      if (!cart || cart.items.length === 0) {
        throw new AppError("سبد خرید شما خالی است", 400);
      }

      const orderItems = [];

      for (const cartItem of cart.items) {
        const product = (await Product.findOne({
          _id: cartItem.product,
          isActive: true,
        })
          .session(session)
          .lean()) as OrderProduct | null;

        if (!product) {
          throw new AppError(
            "یکی از محصولات سبد خرید دیگر قابل سفارش نیست؛ سبد را بررسی کنید",
            409,
          );
        }

        let unitPrice = product.price;
        let compareAtPrice = product.compareAtPrice ?? null;
        let variantSnapshot = {
          id: null as string | null,
          name: null as string | null,
          sku: null as string | null,
          attributes: [] as Array<{ name: string; value: string }>,
        };
        let availableStock = product.stock;

        if (product.hasVariants) {
          if (!cartItem.variantId) {
            throw new AppError(
              `لطفاً تنوع محصول «${product.name}» را در سبد خرید انتخاب کنید`,
              409,
            );
          }

          const variant = product.variants.find(
            (entry) =>
              entry._id.toString() === cartItem.variantId && entry.isActive,
          );

          if (!variant) {
            throw new AppError(
              `تنوع انتخاب‌شده برای محصول «${product.name}» موجود نیست`,
              409,
            );
          }

          unitPrice = variant.price;
          compareAtPrice = variant.compareAtPrice ?? null;
          availableStock = variant.stock;
          variantSnapshot = {
            id: variant._id.toString(),
            name: variant.name,
            sku: variant.sku,
            attributes: variant.attributes.map((attribute) => ({
              name: attribute.name,
              value: attribute.value,
            })),
          };
        } else if (cartItem.variantId) {
          throw new AppError(
            `تنوع انتخاب‌شده برای محصول «${product.name}» معتبر نیست`,
            409,
          );
        }

        if (availableStock < cartItem.quantity) {
          throw new AppError(
            `موجودی محصول «${product.name}» کافی نیست؛ موجودی فعلی: ${availableStock}`,
            409,
          );
        }

        orderItems.push({
          product: product._id,
          productCode: product.productCode,
          name: product.name,
          slug: product.slug,
          image:
            product.images.find((image) => image.isPrimary)?.url ??
            product.images[0]?.url ??
            null,
          variant: variantSnapshot,
          quantity: cartItem.quantity,
          unitPrice,
          compareAtPrice,
          lineTotal: unitPrice * cartItem.quantity,
        });
      }

      const subtotal = orderItems.reduce(
        (total, item) => total + item.lineTotal,
        0,
      );
      const shippingCost = 0;
      const discount = 0;
      const total = subtotal + shippingCost - discount;

      const [createdOrder] = await Order.create(
        [
          {
            user: userId,
            orderNumber,
            items: orderItems,
            shippingAddress: {
              label: address.label,
              recipientName: address.recipientName,
              mobile: address.mobile,
              province: address.province,
              city: address.city,
              postalCode: address.postalCode,
              address: address.address,
              plaque: address.plaque,
              unit: address.unit,
            },
            subtotal,
            shippingCost,
            discount,
            total,
            currency: "IRT",
            status: "pending_payment",
            payment: {
              provider: "unconfigured",
              status: "pending",
            },
            customerNote: input.customerNote ?? "",
          },
        ],
        { session },
      );

      createdOrderId = createdOrder._id;
      cart.items = [];
      await cart.save({ session });
    });
  } finally {
    await session.endSession();
  }

  if (!createdOrderId) {
    throw new AppError("ثبت سفارش انجام نشد", 500);
  }

  const order = await Order.findOne({
    _id: createdOrderId,
    user: userId,
  }).lean();

  if (!order) throw new AppError("سفارش ثبت شد اما دریافت آن ممکن نبود", 500);

  return order;
}

export async function getUserOrders(
  userId: string,
  page = 1,
  limit = 10,
) {
  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));

  const [items, total] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),
    Order.countDocuments({ user: userId }),
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
      hasNextPage: safePage * safeLimit < total,
      hasPreviousPage: safePage > 1,
    },
  };
}

export async function getUserOrderById(
  userId: string,
  orderId: string,
) {
  if (!mongoose.isObjectIdOrHexString(orderId)) {
    throw new AppError("شناسه سفارش معتبر نیست", 400);
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  }).lean();

  if (!order) throw new AppError("سفارش موردنظر پیدا نشد", 404);

  return order;
}
