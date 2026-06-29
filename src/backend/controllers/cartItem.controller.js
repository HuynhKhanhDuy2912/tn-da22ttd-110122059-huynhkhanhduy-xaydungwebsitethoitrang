import CartItem from "../models/CartItem.js";
import { createCrudControllers } from "./base.controller.js";

export default createCrudControllers(CartItem, {
  modelName: "CartItem",
  populate: [
    { path: "cartId", select: "userId" },
    { path: "productId", select: "name price discount" },
    { path: "variantId", select: "size color sku stock" }
  ]
});
