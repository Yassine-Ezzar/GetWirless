import express from 'express';
import { updateLocation, sendSosAlert, getLocationHistory, createSafeZone, getSafeZones } from '../controllers/geolocationController.js';
import { authenticate } from '../middlewares/authMidlewares.js';

const router = express.Router();

router.use(authenticate);

router.post('/update', updateLocation);          
router.post('/sos', sendSosAlert);              
router.get('/history/:childId', getLocationHistory); 
router.post('/safezone', createSafeZone);       
router.get('/safezones/:childId', getSafeZones); 

export default router;