import Media from '../models/Media.js';
import { sendEmail } from '../utils/emailService.js';
import mongoose from 'mongoose'; 

const checkInappropriateContent = async (title, description) => {
  const riskyKeywords = ['violence', 'sexe', 'drogue', 'nudité', 'arme', 'mort', 'torture']; 
  const content = `${title} ${description || ''}`.toLowerCase();

  for (const keyword of riskyKeywords) {
    if (content.includes(keyword)) {
      return { isInappropriate: true, reason: keyword };
    }
  }
  return { isInappropriate: false, reason: null };
};

export const logVideoWatched = async (data) => {
  const { childId, platform, videoId, title, description } = data;

  let video = await Media.findOne({ childId, platform, videoId });
  if (video) {
    video.watchCount += 1;
    video.timestamp = Date.now();
  } else {
    video = new Media({ childId, platform, videoId, title, description });
  }
  return await video.save();
};

export const blockVideo = async (childId, videoId, reason) => {
  const video = await Media.findOneAndUpdate(
    { childId, videoId },
    { isBlocked: true, flaggedReason: reason },
    { new: true }
  );

  if (video) {
    const parentEmail = 'yassineezzar4@gmail.com'; 
    const subject = 'Alerte : Vidéo inappropriée détectée';
    const message = `La vidéo "${video.title}" (ID: ${videoId}) a été bloquée pour la raison suivante : ${reason}.`;
    await sendEmail(parentEmail, subject, message);
  }

  return video;
};

export const getVideoReport = async (childId) => {
  return await Media.aggregate([
    { $match: { childId: new mongoose.Types.ObjectId(childId) } },
    { $group: {
        _id: { platform: '$platform', videoId: '$videoId', title: '$title' },
        totalWatchCount: { $sum: '$watchCount' },
      },
    },
    { $sort: { totalWatchCount: -1 } },
    { $limit: 10 }, // Top 10 vidéos
  ]);
};

export const getVideoHistory = async (childId) => {
  return await Media.find({ childId }).sort({ timestamp: -1 });
};

export { checkInappropriateContent }; 