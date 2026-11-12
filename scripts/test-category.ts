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

    // اولین دسته‌بندی را در دیتابیس ذخیره می‌کنیم
    const category = await Category.create({
      name: "لپ‌تاپ و کامپیوتر",
      slug: "laptop-computer",
      description: "دسته‌بندی اصلی لپ‌تاپ و کامپیوتر",
      parent: null,
      sortOrder: 1,
    });

    console.log("Category created successfully:");
    console.log(category);
  } finally {
    // چه عملیات موفق باشد و چه خطا بدهد، اتصال را می‌بندیم
    await mongoose.disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Category test failed:", error);
  process.exitCode = 1;
});
