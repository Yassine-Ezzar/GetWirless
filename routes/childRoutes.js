import express from "express";
import {
  createChild,
  getChild,
  updateChild,
  deleteChild,
} from "../controllers/childController.js";
import { authenticate } from "../middlewares/authMidlewares.js";

const router = express.Router();

router.post("/create", authenticate, createChild);
router.get("/:childId", authenticate, getChild);
router.put("/:childId", authenticate, updateChild);
router.delete("/:childId", authenticate, deleteChild);

export default router;
