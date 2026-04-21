import Product from "../models/Product.js";
import { createCrudControllers } from "./base.controller.js";

export default createCrudControllers(Product, {
  modelName: "Product",
  populate: [{ path: "categoryId", select: "name" }]
});
