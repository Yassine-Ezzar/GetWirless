// routes/screenTimeRoutes.js
import express from 'express';
import ScreenTimeController from '../controllers/screenTimeController.js';

const router = express.Router();

// Récupère les règles de temps d'écran pour un enfant
router.get('/:childId', ScreenTimeController.getScreenTime);

// Définit ou met à jour les règles de temps d'écran pour un enfant
router.post('/:childId', ScreenTimeController.setScreenTime);

// Met à jour le temps d'écran utilisé
router.put('/:childId/update', ScreenTimeController.updateUsedTime);

// Réinitialise le temps d'écran
router.put('/:childId/reset', ScreenTimeController.resetScreenTime);

export default router;
