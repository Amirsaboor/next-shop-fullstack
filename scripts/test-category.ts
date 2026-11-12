import mongoose from "mongoose";

// آدرس اتصال را از متغیرهای محیطی می‌خوانیم
const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  // بررسی می‌کنیم آدرس دیتابیس وجود داشته باشد
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  // اتصال به MongoDB
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected successfully!");

  // قطع اتصال بعد از پایان تست
  await mongoose.disconnect();
}

main().catch((error: unknown) => {
  console.error("Database connection failed:", error);
  process.exitCode = 1;
});
