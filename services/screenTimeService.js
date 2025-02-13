// services/screenTimeService.js
import ScreenTime from '../models/ScreenTime.js';

class ScreenTimeService {
  // Récupère les règles de temps d'écran d'un enfant
  static async getScreenTime(childId) {
    return await ScreenTime.findOne({ child: childId });
  }

  // Crée ou met à jour les règles de temps d'écran
  static async setScreenTime(childId, dailyLimit, weeklyLimit) {
    let screenTime = await ScreenTime.findOne({ child: childId });

    if (screenTime) {
      screenTime.dailyLimit = dailyLimit;
      screenTime.weeklyLimit = weeklyLimit;
    } else {
      screenTime = new ScreenTime({
        child: childId,
        dailyLimit,
        weeklyLimit,
      });
    }

    await screenTime.save();
    return screenTime;
  }

  // Met à jour le temps d'écran utilisé (aujourd'hui ou cette semaine)
  static async updateUsedTime(childId, timeSpent, isToday = true) {
    const screenTime = await ScreenTime.findOne({ child: childId });

    if (isToday) {
      screenTime.usedToday += timeSpent;
    } else {
      screenTime.usedThisWeek += timeSpent;
    }

    // Si le temps d'écran dépasse les limites, on bloque l'appareil
    if (screenTime.usedToday > screenTime.dailyLimit || screenTime.usedThisWeek > screenTime.weeklyLimit) {
      screenTime.isBlocked = true;
    }

    await screenTime.save();
    return screenTime;
  }

  // Débloque l'appareil si le temps d'écran est réinitialisé
  static async resetScreenTime(childId) {
    const screenTime = await ScreenTime.findOne({ child: childId });

    screenTime.usedToday = 0;
    screenTime.usedThisWeek = 0;
    screenTime.isBlocked = false;

    await screenTime.save();
    return screenTime;
  }
}

export default ScreenTimeService;
