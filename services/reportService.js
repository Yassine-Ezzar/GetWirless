import Report from '../models/Report.js';
import CallSms from '../models/CallSms.js';
import SocialMedia from '../models/SocialMedia.js';
import { Geolocation } from '../models/Geolocation.js';
import Media from '../models/Media.js';
import { sendEmail } from '../utils/emailService.js';
import { io } from '../server.js';

export const getDashboard = async (childId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calls = await CallSms.countDocuments({ childId, timestamp: { $gte: today } });
  const messages = await CallSms.countDocuments({ childId, type: { $in: ['sms', 'whatsapp', 'messenger', 'instagram'] }, timestamp: { $gte: today } });
  const socialMedia = await SocialMedia.countDocuments({ childId, timestamp: { $gte: today } });
  const videos = await Media.countDocuments({ childId, timestamp: { $gte: today } });
  const locations = await Geolocation.countDocuments({ childId, timestamp: { $gte: today } });

  return {
    calls,
    messages,
    socialMedia,
    videos,
    locations,
    lastUpdate: new Date(),
  };
};

export const sendInstantAlert = async (childId, activityType, details) => {
  const alert = new Report({
    childId,
    type: 'alert',
    summary: { activityType },
    details: JSON.stringify(details),
  });
  await alert.save();

  const parentEmail = 'yassineezzar4@gmail.com'; 
  const subject = `Alerte : Activité suspecte détectée (${activityType})`;
  const message = `Une activité suspecte a été détectée pour votre enfant : ${details.message || details}.`;

  await sendEmail(parentEmail, subject, message);
  io.emit(`alert:${childId}`, { activityType, details });

  alert.isSent = true;
  return await alert.save();
};

export const generateReport = async (childId, period) => {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  if (period === 'weekly') startDate.setDate(startDate.getDate() - 7);

  const calls = await CallSms.find({ childId, timestamp: { $gte: startDate } });
  const socialMedia = await SocialMedia.find({ childId, timestamp: { $gte: startDate } });
  const videos = await Media.find({ childId, timestamp: { $gte: startDate } });
  const locations = await Geolocation.find({ childId, timestamp: { $gte: startDate } });

  const summary = {
    totalCalls: calls.length,
    totalSocialMedia: socialMedia.length,
    totalVideos: videos.length,
    totalLocations: locations.length,
    suspiciousActivities: calls.filter(c => c.flaggedKeywords.length > 0).length +
                         socialMedia.filter(s => s.flaggedKeywords.length > 0).length +
                         videos.filter(v => v.isBlocked).length,
  };

  const details = `
    Rapport ${period === 'daily' ? 'quotidien' : 'hebdomadaire'} :
    - Appels : ${summary.totalCalls}
    - Activités sur réseaux sociaux : ${summary.totalSocialMedia}
    - Vidéos regardées : ${summary.totalVideos}
    - Déplacements : ${summary.totalLocations}
    - Activités suspectes : ${summary.suspiciousActivities}
  `;

  const report = new Report({
    childId,
    type: period,
    summary,
    details,
  });
  await report.save();

  const parentEmail = 'yassineezzar4@gmail.com';
  const subject = `Rapport ${period === 'daily' ? 'quotidien' : 'hebdomadaire'} pour votre enfant`;
  await sendEmail(parentEmail, subject, details);

  report.isSent = true;
  return await report.save();
};

export const getReports = async (childId) => {
  return await Report.find({ childId }).sort({ timestamp: -1 });
};