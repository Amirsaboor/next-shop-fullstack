import mongoose from "mongoose";
import { getRootCategories } from "../src/modules/categories/services/category.service.ts";

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully!");

    const categories = await getRootCategories();

    console.log("Root categories:");
    console.log(categories);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Category service test failed:", error);
  process.exitCode = 1;
});
