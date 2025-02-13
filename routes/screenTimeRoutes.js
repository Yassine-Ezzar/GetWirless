import express from "express";
import { setScreenTimeLimit, getScreenTimeInfo, addUsedScreenTime } from "../controllers/screenTimeController.js";

const router = express.Router();

router.post("/set", setScreenTimeLimit); // Définir la limite de temps d'écran
router.get("/:childId", getScreenTimeInfo); // Récupérer les infos de temps d'écran
router.put("/add-time", addUsedScreenTime); // Ajouter du temps utilisé

export default router;
