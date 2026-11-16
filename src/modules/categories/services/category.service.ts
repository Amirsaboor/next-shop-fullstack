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
  const category = await Category.create(input);

  return category.toObject();
}
