import express from "express";
import { getMyRecommendations } from "../controllers/recommendation.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, getMyRecommendations);

export default router;
