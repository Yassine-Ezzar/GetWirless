import express from 'express';
import ContentFilterController from '../controllers/contentFilterController.js';

const router = express.Router();

router.get('/:childId', ContentFilterController.getContentFilter);
router.put('/:childId/lists', ContentFilterController.updateLists);
router.put('/:childId/categories', ContentFilterController.updateCategories);
router.delete('/:childId', ContentFilterController.deleteFilter);

export default router;
