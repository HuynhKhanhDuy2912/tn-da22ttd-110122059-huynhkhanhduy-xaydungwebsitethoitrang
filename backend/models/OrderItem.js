import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant",
    required: true
  },

  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },

  productSnapshot: {
    name: { type: String },
    image: { type: String },
    price: { type: Number },
    discount: { type: Number }
  },

  variantSnapshot: {
    size: { type: String },
    color: { type: String },
    sku: { type: String },
    image: { type: String }
  }
});

export default mongoose.model("OrderItem", orderItemSchema);
