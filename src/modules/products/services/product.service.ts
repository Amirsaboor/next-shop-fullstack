import mongoose from "mongoose";

import { AppError } from "@/lib/errors/app-error";
import Category from "@/modules/categories/models/category.model";

import Product from "../models/product.model";

export type ProductImageInput = {
  url: string;
  alt?: string;
  isPrimary?: boolean;
};

export type ProductSpecificationInput = {
  name: string;
  value: string;
};

export type ProductVariantInput = {
  name: string;
  sku: string;
  attributes?: ProductSpecificationInput[];
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  isActive?: boolean;
};

export type CreateProductInput = {
  name: string;
  productCode: string;
  slug: string;
  description?: string;
  summary?: string;
  category: string;
  brand?: string;
  images?: ProductImageInput[];
  specifications?: ProductSpecificationInput[];
  price: number;
  compareAtPrice?: number | null;
  stock?: number;
  hasVariants?: boolean;
  variants?: ProductVariantInput[];
  tags?: string[];
  isFeatured?: boolean;
  sortOrder?: number;
};

export type UpdateProductInput = Partial<CreateProductInput> & {
  isActive?: boolean;
};

export type GetProductsOptions = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc" | "name";
  featured?: boolean;
};

function validateProductId(id: string) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new AppError("شناسه محصول معتبر نیست", 400);
  }
}

async function validateCategory(categoryId: string) {
  if (!mongoose.isObjectIdOrHexString(categoryId)) {
    throw new AppError("شناسه دسته‌بندی معتبر نیست", 400);
  }

  const categoryExists = await Category.exists({
    _id: categoryId,
    isActive: true,
  });

  if (!categoryExists) {
    throw new AppError("دسته‌بندی محصول پیدا نشد یا غیرفعال است", 404);
  }
}

function validateProductPrices(price: number, compareAtPrice?: number | null) {
  if (!Number.isFinite(price) || price < 0) {
    throw new AppError("قیمت محصول معتبر نیست", 400);
  }

  if (
    compareAtPrice !== undefined &&
    compareAtPrice !== null &&
    (!Number.isFinite(compareAtPrice) || compareAtPrice < price)
  ) {
    throw new AppError("قیمت قبل از تخفیف نمی‌تواند کمتر از قیمت فروش باشد", 400);
  }
}

function validateVariants(
  hasVariants: boolean,
  variants: ProductVariantInput[],
) {
  if (hasVariants && variants.length === 0) {
    throw new AppError("برای محصول دارای تنوع، حداقل یک تنوع ثبت کنید", 400);
  }

  if (!hasVariants && variants.length > 0) {
    throw new AppError("برای ثبت تنوع‌ها، hasVariants باید فعال باشد", 400);
  }

  const skus = variants.map((variant) => variant.sku.trim().toUpperCase());
  if (new Set(skus).size !== skus.length) {
    throw new AppError("کد SKU تنوع‌های یک محصول باید یکتا باشد", 400);
  }

  for (const variant of variants) {
    validateProductPrices(variant.price, variant.compareAtPrice);
    if (!Number.isInteger(variant.stock) || variant.stock < 0) {
      throw new AppError("موجودی هر تنوع باید عدد صحیح نامنفی باشد", 400);
    }
  }
}

export async function getProducts(options: GetProductsOptions = {}) {
  const page = Math.max(1, Math.floor(options.page ?? 1));
  const limit = Math.min(100, Math.max(1, Math.floor(options.limit ?? 12)));
  const filter: Record<string, unknown> = { isActive: true };

  if (options.category) {
    if (!mongoose.isObjectIdOrHexString(options.category)) {
      throw new AppError("شناسه دسته‌بندی معتبر نیست", 400);
    }
    filter.category = options.category;
  }

  if (options.search?.trim()) {
    const searchTerm = options.search.trim();
    filter.$or = [
      { productCode: searchTerm.toUpperCase() },
      { $text: { $search: searchTerm } },
    ];
  }

  if (options.featured !== undefined) filter.isFeatured = options.featured;

  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    filter.price = {
      ...(options.minPrice !== undefined ? { $gte: options.minPrice } : {}),
      ...(options.maxPrice !== undefined ? { $lte: options.maxPrice } : {}),
    };
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    name: { name: 1 },
  } as const;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortOptions[options.sort ?? "newest"])
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category", "name slug")
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getProductById(id: string) {
  validateProductId(id);

  const product = await Product.findOne({ _id: id, isActive: true })
    .populate("category", "name slug")
    .lean();

  if (!product) throw new AppError("محصول پیدا نشد", 404);
  return product;
}

export async function createProduct(input: CreateProductInput) {
  await validateCategory(input.category);
  validateProductPrices(input.price, input.compareAtPrice);

  const hasVariants = input.hasVariants ?? false;
  const variants = input.variants ?? [];
  validateVariants(hasVariants, variants);

  if (!hasVariants && (!Number.isInteger(input.stock ?? 0) || (input.stock ?? 0) < 0)) {
    throw new AppError("موجودی محصول باید عدد صحیح نامنفی باشد", 400);
  }

  const product = await Product.create({
    ...input,
    productCode: input.productCode.trim().toUpperCase(),
    hasVariants,
    variants,
    slug: input.slug.toLowerCase(),
    brand: input.brand?.trim() ?? "",
    tags: input.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
  });

  return product.toObject();
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  validateProductId(id);

  const existingProduct = await Product.findById(id)
    .select("price compareAtPrice hasVariants variants")
    .lean();

  if (!existingProduct) throw new AppError("محصول پیدا نشد", 404);

  if (input.category) await validateCategory(input.category);

  const nextPrice = input.price ?? existingProduct.price;
  const nextCompareAtPrice =
    input.compareAtPrice !== undefined
      ? input.compareAtPrice
      : existingProduct.compareAtPrice;
  validateProductPrices(nextPrice, nextCompareAtPrice);

  const nextHasVariants = input.hasVariants ?? existingProduct.hasVariants;
  const nextVariants = input.variants ?? existingProduct.variants;
  validateVariants(nextHasVariants, nextVariants as ProductVariantInput[]);

  if (
    input.stock !== undefined &&
    (!Number.isInteger(input.stock) || input.stock < 0)
  ) {
    throw new AppError("موجودی محصول باید عدد صحیح نامنفی باشد", 400);
  }

  const updateData = {
    ...input,
    ...(input.productCode ? { productCode: input.productCode.trim().toUpperCase() } : {}),
    ...(input.slug ? { slug: input.slug.toLowerCase() } : {}),
    ...(input.tags ? { tags: input.tags.map((tag) => tag.trim()).filter(Boolean) } : {}),
  };

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).lean();

  if (!product) throw new AppError("محصول پیدا نشد", 404);
  return product;
}

export async function archiveProduct(id: string) {
  validateProductId(id);

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true },
  )
    .select("_id isActive")
    .lean();

  if (!product) throw new AppError("محصول پیدا نشد", 404);
  return product;
}
