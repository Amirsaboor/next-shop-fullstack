import { z } from 'zod';

export const initializePaymentSchema = z.object({
  orderId: z.string().regex(/^[a-f\d]{24}$/i, 'شناسه سفارش معتبر نیست'),
});

export type InitializePaymentInput = z.infer<typeof initializePaymentSchema>;
