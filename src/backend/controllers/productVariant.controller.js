import ProductVariant from "../models/ProductVariant.js";
import { createCrudControllers } from "./base.controller.js";

export default createCrudControllers(ProductVariant, {
  modelName: "ProductVariant",
  populate: [{ path: "productId", select: "name price discount" }]
});
