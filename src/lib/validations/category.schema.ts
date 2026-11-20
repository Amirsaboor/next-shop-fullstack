import { z } from 'zod';

const categoryFields = {
  name: z.string().trim().min(2, 'نام دسته‌بندی الزامی است').max(100),
  slug: z
    .string()
    .trim()
    .min(2, 'اسلاگ دسته‌بندی الزامی است')
    .max(120)
    .regex(/^[a-zA-Z0-9-]+$/, 'اسلاگ فقط می‌تواند شامل حروف انگلیسی، عدد و خط تیره باشد'),
  description: z.string().max(1000).optional(),
  parent: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'شناسه والد معتبر نیست')
    .nullable()
    .optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
};

export const createCategorySchema = z
  .object({
    name: categoryFields.name,
    slug: categoryFields.slug,
    description: categoryFields.description,
    parent: categoryFields.parent,
  })
  .strict();

export const updateCategorySchema = z
  .object(categoryFields)
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, 'حداقل یک فیلد برای ویرایش ارسال کنید');

export type CreateCategorySchemaInput = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchemaInput = z.infer<typeof updateCategorySchema>;
