import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
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

  quantity: { type: Number, default: 1, min: 1 }
});

cartItemSchema.index({ cartId: 1, variantId: 1 }, { unique: true });

export default mongoose.model("CartItem", cartItemSchema);
