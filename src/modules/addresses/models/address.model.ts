import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    recipientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    province: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    plaque: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },
    unit: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

addressSchema.index({ user: 1, createdAt: -1 });

const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
