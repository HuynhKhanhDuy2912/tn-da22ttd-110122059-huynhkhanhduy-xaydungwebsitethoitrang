import Cart from "../models/Cart.js";
import { createCrudControllers } from "./base.controller.js";
import {
  addItemToCart,
  clearCart,
  getCartDetail,
  removeCartItem,
  updateCartItemQuantity
} from "../services/cart.service.js";

const baseCartController = createCrudControllers(Cart, {
  modelName: "Cart",
  populate: [{ path: "userId", select: "username email" }]
});

export const getMyCart = async (req, res) => {
  try {
    const cart = await getCartDetail(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const addMyCartItem = async (req, res) => {
  try {
    const item = await addItemToCart(req.user, req.body);

    return res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: item
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateMyCartItem = async (req, res) => {
  try {
    const item = await updateCartItemQuantity(
      req.user._id,
      req.params.cartItemId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: item
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const removeMyCartItem = async (req, res) => {
  try {
    const item = await removeCartItem(req.user._id, req.params.cartItemId);

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      data: item
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const clearMyCart = async (req, res) => {
  try {
    await clearCart(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  ...baseCartController,
  getMyCart,
  addMyCartItem,
  updateMyCartItem,
  removeMyCartItem,
  clearMyCart
};
