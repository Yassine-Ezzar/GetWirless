import express from 'express';
import { addAppControl, getChildAppControls, updateAppUsage, updateAppRestrictions,blockApp,requestAppInstallation,approveAppInstallation } from '../controllers/appControlController.js';
import { authenticate } from '../middlewares/authMidlewares.js';

const router = express.Router();

router.post('/', authenticate, addAppControl);
router.get('/:childId', authenticate, getChildAppControls);
router.put('/usage', authenticate, updateAppUsage);
router.put('/restrictions', authenticate, updateAppRestrictions);
router.post('/block', blockApp);
router.post('/request', requestAppInstallation);
router.post('/approve', approveAppInstallation);

export default router;