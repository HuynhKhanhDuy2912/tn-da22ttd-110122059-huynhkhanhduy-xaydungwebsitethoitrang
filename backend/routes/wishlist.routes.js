import express from "express";
import wishlistController from "../controllers/wishlist.controller.js";
import Wishlist from "../models/Wishlist.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  attachOwner,
  checkOwnership,
  scopeToOwner
} from "../middlewares/ownership.middleware.js";

const router = express.Router();

router.get("/me", protect, wishlistController.getMyWishlistSummary);
router.post("/me", protect, wishlistController.addWishlistItem);
router.delete("/me/product/:productId", protect, wishlistController.removeWishlistItemByProduct);

router.get("/", protect, scopeToOwner("userId"), wishlistController.list);
router.get("/:id", protect, checkOwnership(Wishlist, "userId"), wishlistController.getById);
router.post("/", protect, attachOwner("userId"), wishlistController.create);
router.put(
  "/:id",
  protect,
  checkOwnership(Wishlist, "userId"),
  attachOwner("userId"),
  wishlistController.update
);
router.delete("/:id", protect, checkOwnership(Wishlist, "userId"), wishlistController.remove);

export default router;
