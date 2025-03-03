import SocialMedia from '../models/SocialMedia.js';
import SocialMediaTime from '../models/SocialMediaTime.js';
import { sendEmail } from '../utils/emailService.js';
import { io } from '../server.js';

export const logActivity = async (data) => {
  const activity = new SocialMedia(data);
  return await activity.save();
};

export const updateTimeSpent = async (childId, platform, minutes) => {
  const today = new Date().setHours(0, 0, 0, 0);
  let timeEntry = await SocialMediaTime.findOne({ childId, platform, date: today });

  if (!timeEntry) {
    timeEntry = new SocialMediaTime({ childId, platform, date: today });
  }

  timeEntry.timeSpent += minutes;
  return await timeEntry.save();
};

export const getLogs = async (childId) => {
  return await SocialMedia.find({ childId }).sort({ timestamp: -1 });
};

export const getTimeSpent = async (childId, platform) => {
  const today = new Date().setHours(0, 0, 0, 0);
  return await SocialMediaTime.findOne({ childId, platform, date: today });
};

export const sendAlert = async (childId, keywords, content, interactedWith) => {
  const parentEmail = 'yassineezzar4@gmail.com'; 
  const subject = 'Alerte : Activité suspecte sur les réseaux sociaux';
  const message = `Activité suspecte détectée pour ${childId}. Mots-clés : ${keywords.join(', ')}. Contenu : "${content}". Interaction avec : ${interactedWith?.username || 'inconnu'}`;

  await sendEmail(parentEmail, subject, message);

  // Notification en temps réel via WebSocket
  io.emit(`alert:${childId}`, { message, keywords, content, interactedWith });

  await SocialMedia.updateOne(
    { childId, content },
    { alertSent: true }
  );
};

export const sendTimeLimitAlert = async (childId, platform, timeSpent) => {
  const parentEmail = 'yassineezzar4@gmail.com';
  const subject = `Alerte : Limite de temps dépassée sur ${platform}`;
  const message = `Votre enfant a dépassé la limite de temps sur ${platform} (${timeSpent} minutes).`;

  await sendEmail(parentEmail, subject, message);
  io.emit(`timeAlert:${childId}`, { platform, timeSpent });
};