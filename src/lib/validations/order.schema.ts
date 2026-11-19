import { z } from "zod";

export const createOrderSchema = z
  .object({
    addressId: z
      .string()
      .regex(/^[a-f\d]{24}$/i, "شناسه آدرس معتبر نیست"),
    customerNote: z.string().trim().max(500).optional(),
  })
  .strict();

export const orderQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .strict();

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
