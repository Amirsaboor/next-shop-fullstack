import Category from "../models/category.model.ts";

export async function getActiveCategories() {
  return Category.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
}
