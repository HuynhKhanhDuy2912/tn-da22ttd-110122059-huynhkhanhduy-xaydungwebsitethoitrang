import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },

    brand: {
      type: String,
      trim: true,
      default: ""
    },

    gender: {
      type: String,
      trim: true,
      enum: ["male", "female", "unisex"],
      default: "unisex"
    },

    material: {
      type: String,
      trim: true,
      default: ""
    },

    style: {
      type: String,
      trim: true,
      enum: [
        "minimal",
        "streetwear",
        "casual",
        "elegant",
        "sporty",
        "vintage",
        "smart_casual"
      ],
      default: "casual"
    },

    season: {
      type: [String],
      enum: ["spring", "summer", "autumn", "winter", "all_season"],
      default: ["all_season"]
    },

    occasion: {
      type: [String],
      enum: ["casual", "work", "party", "date", "travel", "sport", "formal", "street"],
      default: ["casual"]
    },

    images: {
      type: [String],
      default: []
    },

    tags: {
      type: [String],
      default: []
    },

    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },

    totalReviews: {
      type: Number,
      min: 0,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

productSchema.index({ categoryId: 1, gender: 1, isActive: 1 });
productSchema.index({ style: 1, brand: 1 });
productSchema.index({ season: 1 });
productSchema.index({ occasion: 1 });
productSchema.index({ tags: 1 });

export default mongoose.model("Product", productSchema);
