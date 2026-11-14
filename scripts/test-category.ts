import mongoose from "mongoose";
import Category from "../src/modules/categories/models/category.model.ts";

// آدرس اتصال را از متغیرهای محیطی می‌خوانیم
const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  // بررسی می‌کنیم آدرس دیتابیس وجود داشته باشد
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    // ابتدا به MongoDB متصل می‌شویم
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully!");

    // ساخت یک دسته‌بندی موقت برای آزمایش حذف
    const testCategory = await Category.create({
      name: "دسته‌بندی آزمایشی حذف",
      slug: `delete-test-${Date.now()}`,
    });

    console.log("Test category created:");
    console.log(testCategory);
    console.log("Test category ID:", testCategory._id);

    // حذف دسته‌بندی آزمایشی بر اساس شناسه
    const deletedCategory = await Category.findByIdAndDelete(
      testCategory._id,
    );

    if (!deletedCategory) {
      console.log("Category not found for deletion");
      return;
    }

    console.log("Deleted category:");
    console.log(deletedCategory);

    // بررسی می‌کنیم که سند واقعاً از دیتابیس حذف شده باشد
    const categoryAfterDelete = await Category.findById(testCategory._id);

    console.log("Category after deletion:");
    console.log(categoryAfterDelete);


    // دریافت دسته‌بندی‌ها با صفحه‌بندی
    const page = 1;
    const limit = 3;

    const categories = await Category.find()
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log("Pagination result:");
    console.log(categories);
  } finally {
    // چه عملیات موفق باشد و چه خطا بدهد، اتصال را می‌بندیم
    await mongoose.disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Category findByIdAndDelete test failed:", error);
  process.exitCode = 1;
});
