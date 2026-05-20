import mongoose from "mongoose";

const outfitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      }
    ],

    image: {
      type: String,
      trim: true,
      default: ""
    },

    occasion: {
      type: String,
      trim: true,
      enum: [
        "casual",
        "work",
        "party",
        "date",
        "travel",
        "sport",
        "formal",
        "street"
      ],
      default: "casual"
    },

    season: {
      type: String,
      trim: true,
      enum: ["spring", "summer", "autumn", "winter", "all_season"],
      default: "all_season"
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

    genderTarget: {
      type: String,
      trim: true,
      enum: ["male", "female", "unisex"],
      default: "unisex"
    },

    colors: {
      type: [String],
      default: []
    },

    tags: {
      type: [String],
      default: []
    },

    weather: {
      type: [String],
      enum: ["hot", "warm", "cool", "cold", "rainy"],
      default: []
    },

    isActive: {
      type: Boolean,
      default: true
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0
    },

    saveCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

outfitSchema.index({ style: 1, season: 1, occasion: 1 });
outfitSchema.index({ genderTarget: 1, isActive: 1 });
outfitSchema.index({ tags: 1 });
outfitSchema.index({ colors: 1 });

export default mongoose.model("Outfit", outfitSchema);
