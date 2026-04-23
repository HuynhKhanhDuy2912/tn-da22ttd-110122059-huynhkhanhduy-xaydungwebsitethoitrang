import express from "express";
import {
  getMe,
  googleAuth,
  login,
  register,
  requestPhoneOtp,
  verifyPhoneOtp
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/phone/request-otp", requestPhoneOtp);
router.post("/phone/verify-otp", verifyPhoneOtp);
router.get("/me", protect, getMe);

export default router;
