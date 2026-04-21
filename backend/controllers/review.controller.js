import Review from "../models/Review.js";
import { createCrudControllers } from "./base.controller.js";

export default createCrudControllers(Review, {
  modelName: "Review",
  populate: [
    { path: "userId", select: "username avatar" },
    { path: "productId", select: "name" }
  ]
});
