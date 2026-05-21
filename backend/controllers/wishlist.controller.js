import Wishlist from "../models/Wishlist.js";
import { createCrudControllers } from "./base.controller.js";

const baseWishlistController = createCrudControllers(Wishlist, {
  modelName: "Wishlist",
  populate: [
    { path: "userId", select: "username email" },
    { path: "productId", select: "name price discount" }
  ]
});

export const addWishlistItem = async (req, res) => {
  try {
    const existingItem = await Wishlist.findOne({
      userId: req.user._id,
      productId: req.body.productId
    });

    if (existingItem) {
      return res.status(200).json({
        success: true,
        message: "Product is already in wishlist",
        data: existingItem
      });
    }

    const item = await Wishlist.create({
      userId: req.user._id,
      productId: req.body.productId,
      addedFrom: req.body.addedFrom,
      note: req.body.note
    });

    const populatedItem = await Wishlist.findById(item._id)
      .populate("userId", "username email")
      .populate("productId", "name price discount");

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      data: populatedItem
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const removeWishlistItemByProduct = async (req, res) => {
  try {
    const deletedItem = await Wishlist.findOneAndDelete({
      userId: req.user._id,
      productId: req.params.productId
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: deletedItem
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyWishlistSummary = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("productId", "name slug price discount style averageRating gender occasion images tags");

    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: {
        totalItems: items.length,
        items
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  ...baseWishlistController,
  addWishlistItem,
  removeWishlistItemByProduct,
  getMyWishlistSummary
};
