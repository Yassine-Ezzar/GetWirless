// routes/screenTimeRoutes.js
import express from 'express';
import ScreenTimeController from '../controllers/screenTimeController.js';

const router = express.Router();

router.get('/:childId', ScreenTimeController.getScreenTimeLimit);
router.put('/:childId', ScreenTimeController.updateScreenTimeLimit);
router.post('/:childId/track-usage', ScreenTimeController.trackUsage); 
router.post('/:childId/reset', ScreenTimeController.resetScreenTime);
// Limiter l'utilisation des écrans avant le coucher
router.post('/:childId/limit-bedtime', ScreenTimeController.limitScreenBeforeBedtime);

// Suivi des habitudes de sommeil
router.post('/:childId/track-sleep', ScreenTimeController.trackSleepPattern);

// Alerte d'utilisation excessive
router.post('/alert-excessive-usage', ScreenTimeController.alertExcessiveUsage);



export default router;
