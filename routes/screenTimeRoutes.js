import express from 'express';
import ScreenTimeController from '../controllers/screenTimeController.js';

const router = express.Router();

router.get('/:childId', ScreenTimeController.getScreenTimeLimit);
router.put('/:childId', ScreenTimeController.updateScreenTimeLimit);
router.post('/:childId/track-usage', ScreenTimeController.trackUsage); 
router.post('/:childId/reset', ScreenTimeController.resetScreenTime);
router.post('/:childId/limit-bedtime', ScreenTimeController.limitScreenBeforeBedtime);

router.post('/:childId/track-sleep', ScreenTimeController.trackSleepPattern);

router.post('/alert-excessive-usage', ScreenTimeController.alertExcessiveUsage);



export default router;
