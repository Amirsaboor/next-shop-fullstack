import mongoose from 'mongoose';

import { AppError } from '@/lib/errors/app-error';

import Category from '../models/category.model';

export type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
};

export type UpdateCategoryInput = {
  name?: string;
  slug?: string;
  description?: string;
  parent?: string | null;
  isActive?: boolean;
  sortOrder?: number;
};

function validateCategoryId(id: string) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new AppError('شناسه دسته‌بندی معتبر نیست', 400);
  }
}

async function validateParent(parentId: string, categoryId?: string) {
  if (!mongoose.isObjectIdOrHexString(parentId)) {
    throw new AppError('شناسه دسته‌بندی والد معتبر نیست', 400);
  }

  const parentCategory = await Category.findOne({
    _id: parentId,
    isActive: true,
  })
    .select('_id')
    .lean();

  if (!parentCategory) {
    throw new AppError('دسته‌بندی والد پیدا نشد', 404);
  }

  if (categoryId) {
    let currentParentId: unknown = parentId;
    const visited = new Set<string>();

    while (currentParentId) {
      const currentId = String(currentParentId);

      if (currentId === categoryId.toLowerCase()) {
        throw new AppError('یک دسته‌بندی نمی‌تواند والد خودش یا یکی از والدهای خودش باشد', 400);
      }

      if (visited.has(currentId)) {
        throw new AppError('ساختار والد و فرزند دسته‌بندی‌ها معتبر نیست', 400);
      }

      visited.add(currentId);

      const currentCategory = await Category.findById(currentId).select('parent').lean();

      currentParentId = currentCategory?.parent ?? null;
    }
  }
}

export async function getAllCategories() {\n  return Category.find().sort({ sortOrder: 1, name: 1 }).lean();\n}\n\nexport async function getActiveCategories() {
  return Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
}

export async function getRootCategories() {
  return Category.find({
    parent: null,
    isActive: true,
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
}

export async function getCategoryById(id: string) {
  validateCategoryId(id);

  const category = await Category.findById(id).lean();

  if (!category) {
    throw new AppError('دسته‌بندی پیدا نشد', 404);
  }

  return category;
}

export async function createCategory(input: CreateCategoryInput) {
  if (input.parent) {
    await validateParent(input.parent);
  }

  const category = await Category.create({
    ...input,
    slug: input.slug.toLowerCase(),
  });

  return category.toObject();
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  validateCategoryId(id);

  const existingCategory = await Category.findById(id).select('_id').lean();

  if (!existingCategory) {
    throw new AppError('دسته‌بندی پیدا نشد', 404);
  }

  if (input.parent) {
    await validateParent(input.parent, id);
  }

  const updateData = {
    ...input,
    ...(input.slug ? { slug: input.slug.toLowerCase() } : {}),
  };

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).lean();

  if (!updatedCategory) {
    throw new AppError('دسته‌بندی پیدا نشد', 404);
  }

  return updatedCategory;
}

export async function deleteCategory(id: string) {
  validateCategoryId(id);

  const category = await Category.findById(id).select('_id').lean();

  if (!category) {
    throw new AppError('دسته‌بندی پیدا نشد', 404);
  }

  const hasChildren = await Category.exists({ parent: id });

  if (hasChildren) {
    throw new AppError('ابتدا زیردسته‌های این دسته‌بندی را حذف یا منتقل کنید', 409);
  }

  await Category.findByIdAndDelete(id);

  return { id };
}
