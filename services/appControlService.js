import AppControl from '../models/AppControl.js';

export const isAppBlocked = async (childId, appName) => {
    const control = await AppControl.findOne({ childId });
    return control?.blockedApps.includes(appName) || false;
};

export const getPendingRequests = async (childId) => {
    const control = await AppControl.findOne({ childId });
    return control?.pendingApps.filter(app => app.status === 'pending') || [];
};