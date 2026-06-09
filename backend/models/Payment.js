import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  amount: { type: Number, required: true, min: 0 },
  paymentMethod: {
    type: String,
    trim: true,
    enum: ["cod", "vnpay", "paypal"],
    default: "cod"
  },
  paymentStatus: {
    type: String,
    trim: true,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  },

  transactionId: { type: String, trim: true, default: "" },
  paidAt: Date

}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
