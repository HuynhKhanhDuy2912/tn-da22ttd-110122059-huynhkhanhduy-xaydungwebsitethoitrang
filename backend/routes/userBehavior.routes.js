import express from "express";
import userBehaviorController from "../controllers/userBehavior.controller.js";
import UserBehavior from "../models/UserBehavior.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  attachOwner,
  checkOwnership,
  scopeToOwner
} from "../middlewares/ownership.middleware.js";

const router = express.Router();

router.post("/track", protect, userBehaviorController.trackBehavior);
router.get("/summary/me", protect, userBehaviorController.getBehaviorSummary);

router.get("/", protect, scopeToOwner("userId"), userBehaviorController.list);
router.get("/:id", protect, checkOwnership(UserBehavior, "userId"), userBehaviorController.getById);
router.post("/", protect, attachOwner("userId"), userBehaviorController.create);
router.put(
  "/:id",
  protect,
  checkOwnership(UserBehavior, "userId"),
  attachOwner("userId"),
  userBehaviorController.update
);
router.delete(
  "/:id",
  protect,
  checkOwnership(UserBehavior, "userId"),
  userBehaviorController.remove
);

export default router;
