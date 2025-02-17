import express from 'express';
import ScreenTimeController from '../controllers/screenTimeController.js';

const router = express.Router();

router.get('/:childId', ScreenTimeController.getScreenTime);

router.post('/:childId', ScreenTimeController.setScreenTime);

router.put('/:childId/update', ScreenTimeController.updateUsedTime);

router.put('/:childId/reset', ScreenTimeController.resetScreenTime);

export default router;
