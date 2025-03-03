import express from 'express';
import { getDashboard, sendInstantAlert, generateReport, getReports } from '../controllers/reportController.js';
import { authenticate } from '../middlewares/authMidlewares.js';

const router = express.Router();

router.use(authenticate);

router.get('/dashboard/:childId', getDashboard);     
router.post('/alert', sendInstantAlert);            
router.post('/generate', generateReport);         
router.get('/reports/:childId', getReports);        

export default router;