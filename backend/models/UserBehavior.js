import mongoose from "mongoose";

const behaviorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null
    },

    actionType: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "view_product",
        "search",
        "click",
        "favorite",
        "add_to_cart",
        "remove_from_cart",
        "add_to_wishlist",
        "remove_from_wishlist",
        "purchase"
      ]
    },

    source: {
      type: String,
      trim: true,
      enum: [
        "home",
        "search",
        "category",
        "recommendation",
        "wishlist",
        "cart",
        "product_page",
        "other"
      ],
      default: "other"
    },

    duration: {
      type: Number,
      min: 0,
      default: 0
    },

    trackingSessionId: {
      type: String,
      trim: true
    },

    searchKeyword: {
      type: String,
      trim: true,
      default: ""
    },

    metadata: {
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
      occasion: {
        type: String,
        trim: true,
        default: ""
      }
    }
  },
  { timestamps: true }
);

behaviorSchema.index({ userId: 1, createdAt: -1 });
behaviorSchema.index({ userId: 1, actionType: 1, createdAt: -1 });
behaviorSchema.index({ productId: 1, actionType: 1 });
behaviorSchema.index(
  { userId: 1, trackingSessionId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      trackingSessionId: { $exists: true, $type: "string" }
    }
  }
);

export default mongoose.model("UserBehavior", behaviorSchema);
