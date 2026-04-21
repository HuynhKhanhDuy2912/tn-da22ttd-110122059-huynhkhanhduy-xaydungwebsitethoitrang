import SearchHistory from "../models/SearchHistory.js";
import { createCrudControllers } from "./base.controller.js";

export default createCrudControllers(SearchHistory, {
  modelName: "SearchHistory",
  populate: [
    { path: "userId", select: "username email" },
    { path: "filters.categoryId", select: "name" }
  ]
});
