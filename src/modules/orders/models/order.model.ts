import mongoose, { Schema } from 'mongoose';

const orderVariantAttributeSchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productCode: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, default: null },
    variant: {
      id: { type: String, default: null },
      name: { type: String, default: null },
      sku: { type: String, default: null },
      attributes: { type: [orderVariantAttributeSchema], default: [] },
    },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const shippingAddressSchema = new Schema(
  {
    label: { type: String, required: true },
    recipientName: { type: String, required: true },
    mobile: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    address: { type: String, required: true },
    plaque: { type: String, default: '' },
    unit: { type: String, default: '' },
  },
  { _id: false },
);

const paymentSchema = new Schema(
  {
    provider: {
      type: String,
      default: 'unconfigured',
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
      required: true,
    },
    transactionId: { type: String, default: '' },
    paidAt: { type: Date, default: null },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: unknown[]) => items.length > 0,
        message: 'سفارش باید حداقل یک محصول داشته باشد',
      },
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'TOMAN', required: true },
    status: {
      type: String,
      enum: [
        'pending_payment',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending_payment',
      required: true,
    },
    payment: {
      type: paymentSchema,
      default: () => ({}),
    },
    customerNote: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true },
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
