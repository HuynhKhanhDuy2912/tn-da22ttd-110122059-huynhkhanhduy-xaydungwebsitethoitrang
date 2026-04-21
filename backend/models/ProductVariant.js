import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    size: {
      type: String,
      required: true,
      trim: true
    },

    color: {
      type: String,
      required: true,
      trim: true
    },

    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    stock: {
      type: Number,
      min: 0,
      default: 0
    },

    priceAdjustment: {
      type: Number,
      default: 0
    },

    image: {
      type: String,
      trim: true,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

variantSchema.index({ sku: 1 }, { unique: true });
variantSchema.index({ productId: 1, color: 1, size: 1 }, { unique: true });
variantSchema.index({ productId: 1, isActive: 1 });

export default mongoose.model("ProductVariant", variantSchema);
