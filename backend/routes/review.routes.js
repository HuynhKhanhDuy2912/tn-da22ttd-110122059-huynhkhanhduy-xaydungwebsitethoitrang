import { createCrudRouter } from "./base.route.js";
import reviewController from "../controllers/review.controller.js";
import Review from "../models/Review.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  attachOwner,
  checkOwnership,
  scopeToOwner
} from "../middlewares/ownership.middleware.js";

export default createCrudRouter(reviewController, {
  listMiddlewares: [protect, scopeToOwner("userId")],
  getMiddlewares: [protect, checkOwnership(Review, "userId")],
  createMiddlewares: [protect, attachOwner("userId")],
  updateMiddlewares: [protect, checkOwnership(Review, "userId"), attachOwner("userId")],
  deleteMiddlewares: [protect, checkOwnership(Review, "userId")]
});
