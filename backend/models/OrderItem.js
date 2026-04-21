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
  price: { type: Number, required: true, min: 0 }
});

export default mongoose.model("OrderItem", orderItemSchema);
