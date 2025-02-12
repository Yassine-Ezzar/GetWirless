import express from "express";
import { 
  registerParent, loginParent, generateChildCode, loginChild, getUserProfile, 
  forgotPassword, resetPassword 
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMidlewares.js";

const router = express.Router();

router.post("/register", registerParent);
router.post("/login", loginParent);
router.post("/generate-child-code", generateChildCode);
router.post("/login-child", loginChild);
router.get("/profile", authenticate, getUserProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
