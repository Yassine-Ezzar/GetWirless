import express from "express";
import {
  registerParent,
  loginParent,
  generateChildCode,
  loginChild,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMidlewares.js";
import { getUserProfile } from "../controllers/authController.js";




const router = express.Router();
router.get("/profile", authenticate, getUserProfile);
router.post("/register", registerParent);
router.post("/login", loginParent);
router.post("/generate-child-code", generateChildCode);
router.post("/login-child", loginChild);

export default router;
