import 'server-only';

import mongoose from 'mongoose';

import { AppError } from '@/lib/errors/app-error';
import Order from '@/modules/orders/models/order.model';
import Product from '@/modules/products/models/product.model';
import { getPaymentProvider } from '@/modules/payments/providers/payment-provider';

type ConfirmOrderPaymentInput = {
  orderId: string;
  provider: string;
  transactionId: string;
};

export async function initializeOrderPayment(userId: string, orderId: string) {
  if (!mongoose.isObjectIdOrHexString(orderId)) {
    throw new AppError('شناسه سفارش معتبر نیست', 400);
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  }).lean();

  if (!order) {
    throw new AppError('سفارش موردنظر پیدا نشد', 404);
  }

  if (order.status !== 'pending_payment' || order.payment.status !== 'pending') {
    throw new AppError('این سفارش در وضعیت قابل پرداخت نیست', 409);
  }

  const provider = getPaymentProvider();
  const payment = await provider.createPayment({
    orderId: order._id.toString(),
    orderNumber: order.orderNumber,
    amount: order.total,
    currency: order.currency,
    callbackUrl: process.env.PAYMENT_CALLBACK_URL ?? '',
  });

  const updateResult = await Order.updateOne(
    {
      _id: order._id,
      user: userId,
      status: 'pending_payment',
      'payment.status': 'pending',
    },
    {
      $set: {
        'payment.provider': provider.name,
        'payment.transactionId': payment.transactionId,
      },
    },
  );

  if (updateResult.modifiedCount !== 1) {
    throw new AppError('وضعیت سفارش تغییر کرده است؛ دوباره تلاش کنید', 409);
  }

  return {
    orderId: order._id.toString(),
    transactionId: payment.transactionId,
    paymentUrl: payment.paymentUrl,
  };
}

/**
 * Call this function only after the payment gateway's server-to-server
 * verification succeeds. Never expose it through an unauthenticated client API.
 */
export async function confirmOrderPayment(input: ConfirmOrderPaymentInput) {
  if (!mongoose.isObjectIdOrHexString(input.orderId)) {
    throw new AppError('شناسه سفارش معتبر نیست', 400);
  }

  if (!input.provider.trim() || !input.transactionId.trim()) {
    throw new AppError('اطلاعات تراکنش پرداخت معتبر نیست', 400);
  }

  const session = await mongoose.startSession();
  let confirmedOrder: unknown = null;

  try {
    await session.withTransaction(async () => {
      const order = await Order.findById(input.orderId).session(session);

      if (!order) {
        throw new AppError('سفارش موردنظر پیدا نشد', 404);
      }

      // Idempotency: repeated verified callbacks never deduct stock twice.
      if (order.payment.status === 'paid') {
        confirmedOrder = order.toObject();
        return;
      }

      if (order.status !== 'pending_payment' || order.payment.status !== 'pending') {
        throw new AppError('این سفارش در وضعیت قابل تأیید نیست', 409);
      }

      for (const item of order.items) {
        const quantity = item.quantity;
        const variantId = item.variant?.id;
        let updateResult;

        if (variantId) {
          if (!mongoose.isObjectIdOrHexString(variantId)) {
            throw new AppError('تنوع یکی از محصولات سفارش معتبر نیست', 409);
          }

          const variantObjectId = new mongoose.Types.ObjectId(variantId);
          updateResult = await Product.updateOne(
            {
              _id: item.product,
              isActive: true,
              hasVariants: true,
              variants: {
                $elemMatch: {
                  _id: variantObjectId,
                  isActive: true,
                  stock: { $gte: quantity },
                },
              },
            },
            {
              $inc: { 'variants.$[variant].stock': -quantity },
            },
            {
              session,
              arrayFilters: [
                {
                  'variant._id': variantObjectId,
                  'variant.isActive': true,
                  'variant.stock': { $gte: quantity },
                },
              ],
            },
          );
        } else {
          updateResult = await Product.updateOne(
            {
              _id: item.product,
              isActive: true,
              hasVariants: false,
              stock: { $gte: quantity },
            },
            { $inc: { stock: -quantity } },
            { session },
          );
        }

        if (updateResult.modifiedCount !== 1) {
          throw new AppError(
            `موجودی محصول «${item.name}» کافی نیست؛ پرداخت سفارش قابل تأیید نیست`,
            409,
          );
        }
      }

      const updatedOrder = await Order.findOneAndUpdate(
        {
          _id: order._id,
          status: 'pending_payment',
          'payment.status': 'pending',
        },
        {
          $set: {
            status: 'processing',
            'payment.status': 'paid',
            'payment.provider': input.provider,
            'payment.transactionId': input.transactionId,
            'payment.paidAt': new Date(),
          },
        },
        { new: true, session },
      );

      if (!updatedOrder) {
        throw new AppError('تغییر وضعیت پرداخت سفارش انجام نشد', 409);
      }

      confirmedOrder = updatedOrder.toObject();
    });
  } finally {
    await session.endSession();
  }

  if (!confirmedOrder) {
    throw new AppError('تأیید پرداخت سفارش انجام نشد', 500);
  }

  return confirmedOrder;
}
