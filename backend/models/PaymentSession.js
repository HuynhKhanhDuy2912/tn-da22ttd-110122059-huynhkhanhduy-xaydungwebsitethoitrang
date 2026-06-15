import mongoose from "mongoose";

const paymentSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["paypal", "vnpay"],
      required: true,
    },
    providerOrderId: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    checkoutPayload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["created", "completed", "cancelled", "failed"],
      default: "created",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

export default mongoose.model("PaymentSession", paymentSessionSchema);
