import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'شناسه محصول معتبر نیست');

export const addCartItemSchema = z
  .object({
    productId: objectIdSchema,
    variantId: z
      .string()
      .regex(/^[a-f\d]{24}$/i, 'شناسه تنوع محصول معتبر نیست')
      .optional(),
    quantity: z.number().int().min(1).max(99).default(1),
  })
  .strict();

export const updateCartItemSchema = z
  .object({
    quantity: z.number().int().min(1).max(99),
  })
  .strict();

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
