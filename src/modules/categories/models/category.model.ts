import mongoose, { Schema } from 'mongoose';

export const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
    },

    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);


const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;
