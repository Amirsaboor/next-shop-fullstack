import mongoose from 'mongoose';
import Category from '../src/modules/categories/models/category.model.ts';

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully!');

    // 1. دریافت مقادیر یکتا
    const uniqueStatuses = await Category.distinct('isActive');

    console.log('Unique statuses:');
    console.log(uniqueStatuses);

    // 2. بررسی وجود یک دسته‌بندی
    const firstCategory = await Category.findOne().select('_id slug').lean();

    const categoryExists = firstCategory ? await Category.exists({ _id: firstCategory._id }) : null;

    console.log('Category exists:');
    console.log(categoryExists);

    // 3. دریافت دسته‌بندی‌های فرزند همراه با اطلاعات والد
    const childCategories = await Category.find({
      parent: { $ne: null },
    }).populate('parent', 'name slug');

    console.log('Child categories with parent:');
    console.log(childCategories);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('Category pagination test failed:', error);
  process.exitCode = 1;
});
