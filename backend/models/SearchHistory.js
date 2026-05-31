import mongoose from "mongoose";

const searchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    keyword: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100
    },

    filters: {
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
      },
      style: {
        type: String,
        trim: true,
        default: ""
      },
      color: {
        type: String,
        trim: true,
        default: ""
      },
      season: {
        type: String,
        trim: true,
        default: ""
      },
      occasion: {
        type: String,
        trim: true,
        default: ""
      },
      gender: {
        type: String,
        trim: true,
        default: ""
      },
      minPrice: {
        type: Number,
        min: 0,
        default: null
      },
      maxPrice: {
        type: Number,
        min: 0,
        default: null
      }
    },

    resultCount: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  { timestamps: true }
);

searchSchema.index({ userId: 1, createdAt: -1 });
searchSchema.index({ keyword: 1 });

export default mongoose.model("SearchHistory", searchSchema);
