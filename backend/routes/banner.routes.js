import express from "express";
import bannerController from "../controllers/banner.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/active", bannerController.getActiveBanners);

// Admin routes
router.get("/admin/all", protect, authorize("admin"), bannerController.getAdminBanners);
router.post("/admin", protect, authorize("admin"), bannerController.create);
router.get("/admin/:id", protect, authorize("admin"), bannerController.getById);
router.put("/admin/:id", protect, authorize("admin"), bannerController.update);
router.delete("/admin/:id", protect, authorize("admin"), bannerController.remove);

router.patch(
  "/admin/:bannerId/toggle",
  protect,
  authorize("admin"),
  bannerController.toggleBannerStatus
);

router.patch(
  "/admin/:bannerId/order",
  protect,
  authorize("admin"),
  bannerController.updateBannerOrder
);

export default router;
