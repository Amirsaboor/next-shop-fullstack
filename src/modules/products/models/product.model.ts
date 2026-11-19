import mongoose, { Schema } from "mongoose";

const productImageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false },
);

const productSpecificationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const productVariantAttributeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const productVariantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, uppercase: true },
    attributes: { type: [productVariantAttributeSchema], default: [] },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    productCode: { type: String, required: true, trim: true, uppercase: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, default: "" },
    summary: { type: String, default: "", trim: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: { type: String, default: "", trim: true },
    images: { type: [productImageSchema], default: [] },
    specifications: { type: [productSpecificationSchema], default: [] },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    hasVariants: { type: Boolean, default: false },
    variants: { type: [productVariantSchema], default: [] },
    tags: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

productSchema.index({ productCode: 1 }, { unique: true, partialFilterExpression: { productCode: { $type: "string" } } });
productSchema.index({ name: "text", summary: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, isActive: 1, sortOrder: 1 });
productSchema.index({ price: 1, isActive: 1 });

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
