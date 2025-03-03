import * as socialMediaService from '../services/socialMediaService.js';
import { detectRiskyKeywords } from '../utils/helpers.js';

export const logSocialMediaActivity = async (req, res, next) => {
  try {
    const { childId, platform, activityType, content, interactedWith } = req.body;
    const flaggedKeywords = content ? detectRiskyKeywords(content) : [];

    const data = {
      childId,
      platform,
      activityType,
      content,
      interactedWith,
      flaggedKeywords,
    };

    const result = await socialMediaService.logActivity(data);
    if (flaggedKeywords.length > 0 || (interactedWith && interactedWith.isSuspicious)) {
      await socialMediaService.sendAlert(childId, flaggedKeywords, content, interactedWith);
    }

    res.status(201).json({ message: 'Activité enregistrée', data: result });
  } catch (error) {
    next(error);
  }
};

export const updateTimeSpent = async (req, res, next) => {
  try {
    const { childId, platform, minutes } = req.body;
    const result = await socialMediaService.updateTimeSpent(childId, platform, minutes);
    if (result.timeSpent > result.dailyLimit) {
      await socialMediaService.sendTimeLimitAlert(childId, platform, result.timeSpent);
    }
    res.status(200).json({ message: 'Temps mis à jour', data: result });
  } catch (error) {
    next(error);
  }
};

export const getSocialMediaLogs = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const logs = await socialMediaService.getLogs(childId);
    res.status(200).json({ data: logs });
  } catch (error) {
    next(error);
  }
};

export const getTimeSpent = async (req, res, next) => {
  try {
    const { childId, platform } = req.params;
    const timeData = await socialMediaService.getTimeSpent(childId, platform);
    res.status(200).json({ data: timeData });
  } catch (error) {
    next(error);
  }
};