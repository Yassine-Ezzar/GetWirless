import express from 'express';
import { logSocialMediaActivity, updateTimeSpent, getSocialMediaLogs, getTimeSpent } from '../controllers/socialMediaController.js';
import { authenticate } from '../middlewares/authMidlewares.js';

const router = express.Router();

router.use(authenticate);

router.post('/log', logSocialMediaActivity); 
router.post('/time', updateTimeSpent);       
router.get('/logs/:childId', getSocialMediaLogs); 
router.get('/time/:childId/:platform', getTimeSpent); 

export default router;