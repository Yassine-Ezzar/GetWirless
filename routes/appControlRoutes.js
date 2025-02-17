import express from 'express';
import ApplicationControlController from '../controllers/appControlController.js';

const router = express.Router();

router.get('/:childId', ApplicationControlController.getControl);
router.put('/:childId/lists', ApplicationControlController.updateLists);
router.put('/:childId/log-usage', ApplicationControlController.logUsage);
router.put('/:childId/request-install', ApplicationControlController.requestInstall);
router.put('/:childId/approve-install', ApplicationControlController.approveInstall);
router.put('/:childId/toggle-purchase', ApplicationControlController.togglePurchaseRestriction);

export default router;
