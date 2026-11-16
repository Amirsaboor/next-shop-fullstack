import mongoose from "mongoose";

import { AppError } from "@/lib/errors/app-error";

import Category from "../models/category.model.ts";

export type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
};

export async function getActiveCategories() {
  return Category.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
}

export async function getRootCategories() {
  return Category.find({
    parent: null,
    isActive: true,
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
}

export async function createCategory(input: CreateCategoryInput) {
  if (input.parent) {
    if (!mongoose.isValidObjectId(input.parent)) {
      throw new AppError("شناسه دسته‌بندی والد معتبر نیست", 400);
    }

    const parentCategoryExists = await Category.exists({
      _id: input.parent,
      isActive: true,
    });

    if (!parentCategoryExists) {
      throw new AppError(
        "دسته‌بندی والد پیدا نشد یا غیرفعال است",
        404,
      );
    }
  }

  const category = await Category.create({
    ...input,
    slug: input.slug.toLowerCase(),
  });

  return category.toObject();
}
