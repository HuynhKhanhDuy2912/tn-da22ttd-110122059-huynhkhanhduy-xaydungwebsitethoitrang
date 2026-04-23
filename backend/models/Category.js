import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },

  imageUrl: {
    type: String,
    trim: true,
    default: ""
  },

  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null
  }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
