import Category from "../models/Category.js";
import { createCrudControllers } from "./base.controller.js";

export default createCrudControllers(Category, {
  modelName: "Category",
  populate: [{ path: "parentId", select: "name" }]
});
