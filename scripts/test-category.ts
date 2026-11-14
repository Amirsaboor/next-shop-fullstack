import mongoose from "mongoose";
import Category from "../src/modules/categories/models/category.model.ts";

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully!");

    const page = 1;
    const limit = 3;

    const categories = await Category.find()
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log("Pagination result:");
    console.log(categories);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Category pagination test failed:", error);
  process.exitCode = 1;
});
