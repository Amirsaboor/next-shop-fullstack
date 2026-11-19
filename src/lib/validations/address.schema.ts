import { z } from "zod";

const addressFields = {
  label: z.string().trim().min(1, "عنوان آدرس الزامی است").max(40),
  recipientName: z.string().trim().min(3, "نام گیرنده معتبر نیست").max(120),
  mobile: z.string().trim().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
  province: z.string().trim().min(2, "استان الزامی است").max(60),
  city: z.string().trim().min(2, "شهر الزامی است").max(60),
  postalCode: z.string().trim().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
  address: z.string().trim().min(5, "نشانی کامل را وارد کنید").max(500),
  plaque: z.string().trim().max(20).optional(),
  unit: z.string().trim().max(20).optional(),
  isDefault: z.boolean().optional(),
};

export const createAddressSchema = z.object(addressFields).strict();

export const updateAddressSchema = z
  .object(addressFields)
  .partial()
  .strict()
  .refine(
    (value) => Object.keys(value).length > 0,
    "حداقل یک فیلد برای ویرایش ارسال کنید",
  );

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
