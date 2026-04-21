import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  imageUrl: String,
  isMain: { type: Boolean, default: false }

});

export default mongoose.model("ProductImage", productImageSchema);