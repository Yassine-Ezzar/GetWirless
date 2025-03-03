import * as geolocationService from '../services/geolocationService.js';

export const updateLocation = async (req, res, next) => {
  try {
    const { childId, latitude, longitude } = req.body;
    const location = await geolocationService.updateLocation(childId, latitude, longitude);
    await geolocationService.checkSafeZones(childId, latitude, longitude);
    res.status(201).json({ message: 'Position mise à jour', data: location });
  } catch (error) {
    next(error);
  }
};

export const sendSosAlert = async (req, res, next) => {
  try {
    const { childId, latitude, longitude } = req.body;
    const sos = await geolocationService.sendSosAlert(childId, latitude, longitude);
    res.status(200).json({ message: 'Alerte SOS envoyée', data: sos });
  } catch (error) {
    next(error);
  }
};

export const getLocationHistory = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const history = await geolocationService.getLocationHistory(childId);
    res.status(200).json({ data: history });
  } catch (error) {
    next(error);
  }
};

export const createSafeZone = async (req, res, next) => {
  try {
    const { childId, name, latitude, longitude, radius } = req.body;
    const safeZone = await geolocationService.createSafeZone(childId, name, latitude, longitude, radius);
    res.status(201).json({ message: 'Zone sécurisée créée', data: safeZone });
  } catch (error) {
    next(error);
  }
};

export const getSafeZones = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const zones = await geolocationService.getSafeZones(childId);
    res.status(200).json({ data: zones });
  } catch (error) {
    next(error);
  }
};