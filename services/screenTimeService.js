import SleepTracker from '../models/SleepTracker.js';
import ScreenTimeLimit from '../models/ScreenTimeLimit.js';
import moment from 'moment';

class ScreenTimeService {
  static async checkDailyLimit(childId) {
    const screenTimeLimit = await ScreenTimeLimit.findOne({ child: childId });
    if (!screenTimeLimit) throw new Error("Pas de règle définie pour ce parent.");

    const currentDate = moment().startOf('day');
    if (moment(screenTimeLimit.lastReset).isBefore(currentDate)) {
      screenTimeLimit.timeSpent = 0; // Réinitialisation quotidienne
      screenTimeLimit.lastReset = Date.now();
      await screenTimeLimit.save();
    }

    return screenTimeLimit;
  }

  static async isBlocked(childId) {
    const screenTimeLimit = await ScreenTimeLimit.findOne({ child: childId });
    if (!screenTimeLimit) return false;

    return screenTimeLimit.timeSpent >= screenTimeLimit.dailyLimit;
  }

  static async limitScreenBeforeBedtime(childId) {
    const screenTimeLimit = await ScreenTimeLimit.findOne({ child: childId });
    const currentTime = moment().format('HH:mm');
    const bedtime = screenTimeLimit.bedtime || "22:00"; // Définir l'heure de coucher

    if (moment(currentTime, 'HH:mm').isAfter(moment(bedtime, 'HH:mm'))) {
      screenTimeLimit.blockAppsBeforeBedtime = true;
      await screenTimeLimit.save();
    }
  }

  // Suivi des habitudes de sommeil
  static async trackSleep(childId, sleepStartTime, sleepEndTime) {
    const sleepData = new SleepTracker({
      child: childId,
      sleepStartTime,
      sleepEndTime,
      sleepDuration: moment(sleepEndTime).diff(moment(sleepStartTime), 'hours'),
      date: moment().format('YYYY-MM-DD')
    });

    await sleepData.save();
  }

  // Vérifier l'utilisation excessive d'une application
  static async checkExcessiveUsage(childId, appName, maxUsageTime) {
    const screenTimeLimit = await ScreenTimeLimit.findOne({ child: childId });
    const appUsage = screenTimeLimit.appUsage[appName] || 0;
    return appUsage > maxUsageTime;
  }

  // Vérifier les comportements suspects
  static async checkSuspiciousBehavior(childId, contentType) {
    const screenTimeLimit = await ScreenTimeLimit.findOne({ child: childId });
    return screenTimeLimit.restrictedContent.includes(contentType);
  }
}

export default ScreenTimeService;
