import * as reportService from '../services/reportService.js';

export const getDashboard = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const dashboard = await reportService.getDashboard(childId);
    res.status(200).json({ message: 'Tableau de bord récupéré', data: dashboard });
  } catch (error) {
    next(error);
  }
};

export const sendInstantAlert = async (req, res, next) => {
  try {
    const { childId, activityType, details } = req.body;
    const alert = await reportService.sendInstantAlert(childId, activityType, details);
    res.status(201).json({ message: 'Alerte envoyée', data: alert });
  } catch (error) {
    next(error);
  }
};

export const generateReport = async (req, res, next) => {
  try {
    const { childId, period } = req.body; 
    const report = await reportService.generateReport(childId, period);
    res.status(201).json({ message: `Rapport ${period} généré`, data: report });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const reports = await reportService.getReports(childId);
    res.status(200).json({ data: reports });
  } catch (error) {
    next(error);
  }
};