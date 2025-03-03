import express from 'express';
import { logVideoWatched, blockVideoManually, getVideoReport, getVideoHistory } from '../controllers/mediaController.js';
import { authenticate } from '../middlewares/authMidlewares.js';

const router = express.Router();

router.use(authenticate);

router.post('/log', logVideoWatched);         
router.post('/block', blockVideoManually);    
router.get('/report/:childId', getVideoReport); 
router.get('/history/:childId', getVideoHistory); 

export default router;