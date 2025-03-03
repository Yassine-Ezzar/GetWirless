import * as mediaService from '../services/mediaService.js';

export const logVideoWatched = async (req, res, next) => {
  try {
    const { childId, platform, videoId, title, description } = req.body;

    const data = { childId, platform, videoId, title, description };
    const result = await mediaService.logVideoWatched(data);

    // Vérification IA pour contenu inapproprié
    const isInappropriate = await mediaService.checkInappropriateContent(title, description);
    if (isInappropriate) {
      await mediaService.blockVideo(childId, videoId, isInappropriate.reason);
      res.status(201).json({ message: 'Vidéo enregistrée et bloquée', data: result });
    } else {
      res.status(201).json({ message: 'Vidéo enregistrée', data: result });
    }
  } catch (error) {
    next(error);
  }
};

export const blockVideoManually = async (req, res, next) => {
  try {
    const { childId, videoId, reason } = req.body;
    const result = await mediaService.blockVideo(childId, videoId, reason);
    res.status(200).json({ message: 'Vidéo bloquée', data: result });
  } catch (error) {
    next(error);
  }
};

export const getVideoReport = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const report = await mediaService.getVideoReport(childId);
    res.status(200).json({ data: report });
  } catch (error) {
    next(error);
  }
};

export const getVideoHistory = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const history = await mediaService.getVideoHistory(childId);
    res.status(200).json({ data: history });
  } catch (error) {
    next(error);
  }
};