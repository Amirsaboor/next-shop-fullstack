import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "شناسه معتبر نیست");
const specificationSchema = z.object({
  name: z.string().trim().min(1).max(100),
  value: z.string().trim().min(1).max(500),
}).strict();

const imageSchema = z.object({
  url: z.string().url("آدرس تصویر معتبر نیست").max(2048),
  alt: z.string().max(250).optional(),
  isPrimary: z.boolean().optional(),
}).strict();

const variantSchema = z.object({
  name: z.string().trim().min(1).max(100),
  sku: z.string().trim().min(1).max(80),
  attributes: z.array(specificationSchema).max(30).optional(),
  price: z.number().finite().min(0),
  compareAtPrice: z.number().finite().min(0).nullable().optional(),
  stock: z.number().int().min(0),
  isActive: z.boolean().optional(),
}).strict().refine(
  (variant) => variant.compareAtPrice == null || variant.compareAtPrice >= variant.price,
  "قیمت قبل از تخفیف نمی‌تواند کمتر از قیمت فروش باشد",
);

const productFields = {
  name: z.string().trim().min(2).max(180),
  productCode: z.string().trim().min(1, "کد محصول الزامی است").max(80),
  slug: z.string().trim().min(2).max(180).regex(/^[a-zA-Z0-9-]+$/),
  description: z.string().max(10000).optional(),
  summary: z.string().max(500).optional(),
  category: objectIdSchema,
  brand: z.string().max(100).optional(),
  images: z.array(imageSchema).max(30).optional(),
  specifications: z.array(specificationSchema).max(100).optional(),
  price: z.number().finite().min(0),
  compareAtPrice: z.number().finite().min(0).nullable().optional(),
  stock: z.number().int().min(0).optional(),
  hasVariants: z.boolean().optional(),
  variants: z.array(variantSchema).max(100).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
};

export const createProductSchema = z.object(productFields)
  .omit({ isActive: true })
  .strict()
  .superRefine((product, context) => {
    if (product.compareAtPrice != null && product.compareAtPrice < product.price) {
      context.addIssue({ code: "custom", path: ["compareAtPrice"], message: "قیمت قبل از تخفیف نمی‌تواند کمتر از قیمت فروش باشد" });
    }
    const variants = product.variants ?? [];
    if (product.hasVariants && variants.length === 0) {
      context.addIssue({ code: "custom", path: ["variants"], message: "برای محصول دارای تنوع، حداقل یک تنوع ثبت کنید" });
    }
    if (!product.hasVariants && variants.length > 0) {
      context.addIssue({ code: "custom", path: ["hasVariants"], message: "برای ثبت تنوع‌ها، hasVariants باید فعال باشد" });
    }
    const skus = variants.map((variant) => variant.sku.trim().toUpperCase());
    if (new Set(skus).size !== skus.length) {
      context.addIssue({ code: "custom", path: ["variants"], message: "کد SKU تنوع‌های یک محصول باید یکتا باشد" });
    }
  });

export const updateProductSchema = z.object(productFields)
  .partial()
  .strict()
  .refine((value) => Object.keys(value).length > 0, "حداقل یک فیلد برای ویرایش ارسال کنید")
  .superRefine((product, context) => {
    if (product.price !== undefined && product.compareAtPrice != null && product.compareAtPrice < product.price) {
      context.addIssue({ code: "custom", path: ["compareAtPrice"], message: "قیمت قبل از تخفیف نمی‌تواند کمتر از قیمت فروش باشد" });
    }
    if (product.variants && product.variants.length > 0 && product.hasVariants === false) {
      context.addIssue({ code: "custom", path: ["hasVariants"], message: "برای ثبت تنوع‌ها، hasVariants باید فعال باشد" });
    }
  });

export type CreateProductSchemaInput = z.infer<typeof createProductSchema>;
export type UpdateProductSchemaInput = z.infer<typeof updateProductSchema>;

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  category: objectIdSchema.optional(),
  search: z.string().trim().max(120).optional(),
  minPrice: z.coerce.number().finite().min(0).optional(),
  maxPrice: z.coerce.number().finite().min(0).optional(),
  sort: z.enum(["newest", "oldest", "price-asc", "price-desc", "name"]).default("newest"),
  featured: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
}).strict().refine(
  (query) => query.minPrice === undefined || query.maxPrice === undefined || query.minPrice <= query.maxPrice,
  { path: ["minPrice"], message: "حداقل قیمت نمی‌تواند بیشتر از حداکثر قیمت باشد" },
);
