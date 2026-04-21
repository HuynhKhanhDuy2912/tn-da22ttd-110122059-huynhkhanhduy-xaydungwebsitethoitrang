import ProductImage from "../models/PrductImage.js";
import { createCrudControllers } from "./base.controller.js";

export default createCrudControllers(ProductImage, {
  modelName: "ProductImage",
  populate: [{ path: "productId", select: "name" }]
});
