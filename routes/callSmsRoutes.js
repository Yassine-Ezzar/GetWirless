import express from 'express';
import { logCallOrMessage, blockContact, getCallSmsLogs } from '../controllers/callSmsController.js';
import { authenticate } from '../middlewares/authMidlewares.js';

const router = express.Router();

router.use(authenticate);

router.post('/log', logCallOrMessage); 
router.post('/block', blockContact);   
router.get('/logs/:childId', getCallSmsLogs); 

export default router;