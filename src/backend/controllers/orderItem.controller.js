import OrderItem from "../models/OrderItem.js";
import { createCrudControllers } from "./base.controller.js";

export default createCrudControllers(OrderItem, {
  modelName: "OrderItem",
  populate: [
    { path: "orderId", select: "status totalPrice" },
    { path: "productId", select: "name price discount" },
    { path: "variantId", select: "size color sku" }
  ]
});
