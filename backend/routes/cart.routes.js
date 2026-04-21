import express from "express";
import cartController from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, cartController.getMyCart);
router.post("/me/items", protect, cartController.addMyCartItem);
router.put("/me/items/:cartItemId", protect, cartController.updateMyCartItem);
router.delete("/me/items/:cartItemId", protect, cartController.removeMyCartItem);
router.delete("/me/items", protect, cartController.clearMyCart);

export default router;
