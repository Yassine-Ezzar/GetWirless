import { Geolocation, SafeZone } from '../models/Geolocation.js';
import { sendEmail } from '../utils/emailService.js';
import { io } from '../server.js';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; 
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
};

export const updateLocation = async (childId, latitude, longitude) => {
  const location = new Geolocation({
    childId,
    coordinates: { latitude, longitude },
  });
  return await location.save();
};

export const sendSosAlert = async (childId, latitude, longitude) => {
  const sos = new Geolocation({
    childId,
    coordinates: { latitude, longitude },
    isSos: true,
  });
  await sos.save();

  const parentEmail = 'yassineezzar4@gmail.com'; 
  const subject = 'Alerte SOS : Votre enfant a besoin d’aide !';
  const message = `Alerte SOS envoyée depuis les coordonnées : (${latitude}, ${longitude}).`;

  await sendEmail(parentEmail, subject, message);
  io.emit(`sos:${childId}`, { latitude, longitude, timestamp: sos.timestamp });

  return sos;
};

export const getLocationHistory = async (childId) => {
  return await Geolocation.find({ childId }).sort({ timestamp: -1 });
};

export const createSafeZone = async (childId, name, latitude, longitude, radius) => {
  const safeZone = new SafeZone({
    childId,
    name,
    coordinates: { latitude, longitude },
    radius,
  });
  return await safeZone.save();
};

export const getSafeZones = async (childId) => {
  return await SafeZone.find({ childId });
};

export const checkSafeZones = async (childId, latitude, longitude) => {
  const safeZones = await SafeZone.find({ childId });
  const parentEmail = 'yassineezzar4@gmail.com';

  for (const zone of safeZones) {
    const distance = calculateDistance(
      latitude,
      longitude,
      zone.coordinates.latitude,
      zone.coordinates.longitude
    );

    const wasInside = zone.lastStatus === 'inside'; 
    const isInside = distance <= zone.radius;

    if (wasInside && !isInside) {
      const message = `Votre enfant a quitté la zone sécurisée "${zone.name}" à (${latitude}, ${longitude}).`;
      await sendEmail(parentEmail, `Sortie de ${zone.name}`, message);
      io.emit(`zoneAlert:${childId}`, { type: 'exit', zone: zone.name, latitude, longitude });
    } else if (!wasInside && isInside) {
      const message = `Votre enfant est entré dans la zone sécurisée "${zone.name}" à (${latitude}, ${longitude}).`;
      await sendEmail(parentEmail, `Entrée dans ${zone.name}`, message);
      io.emit(`zoneAlert:${childId}`, { type: 'enter', zone: zone.name, latitude, longitude });
    }

    zone.lastStatus = isInside ? 'inside' : 'outside';
    await zone.save();
  }
};