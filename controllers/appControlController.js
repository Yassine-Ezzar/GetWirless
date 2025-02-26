import AppControl from '../models/AppControl.js';
import { checkAlert, formatStats } from '../utils/helpers.js';

export const addAppControl = async (req, res) => {
  try {
    const appControl = new AppControl(req.body);
    await appControl.save();
    res.status(201).json(appControl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChildAppControls = async (req, res) => {
  try {
    const apps = await AppControl.find({ childId: req.params.childId });
    res.json(formatStats(apps));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppUsage = async (req, res) => {
  try {
    const { childId, appName, minutes } = req.body;
    const app = await AppControl.findOneAndUpdate(
      { childId, appName },
      { $inc: { usageTime: minutes } },
      { new: true, upsert: true }
    );
    checkAlert(app);
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppRestrictions = async (req, res) => {
  try {
    const { childId, appName, blocked, dailyLimit, purchaseRestricted } = req.body;
    const app = await AppControl.findOneAndUpdate(
      { childId, appName },
      { blocked, dailyLimit, purchaseRestricted },
      { new: true }
    );
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const blockApp = async (req, res) => {
  const { childId, appName } = req.body;
  try {
      const appControl = await AppControl.findOneAndUpdate(
          { childId },
          { $addToSet: { blockedApps: appName } },
          { new: true, upsert: true }
      );
      res.status(200).json(appControl);
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors du blocage de l’application' });
  }
};

export const requestAppInstallation = async (req, res) => {
  const { childId, appName } = req.body;
  try {
      const appControl = await AppControl.findOneAndUpdate(
          { childId },
          { $push: { pendingApps: { name: appName } } },
          { new: true, upsert: true }
      );
      res.status(200).json({ message: 'Demande envoyée', appControl });
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la demande' });
  }
};

export const approveAppInstallation = async (req, res) => {
  const { childId, appName } = req.body;
  try {
      const appControl = await AppControl.findOneAndUpdate(
          { childId, 'pendingApps.name': appName },
          { $set: { 'pendingApps.$.status': 'approved' } },
          { new: true }
      );
      res.status(200).json({ message: 'Application approuvée', appControl });
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l’approbation' });
  }
};