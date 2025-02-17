import ScreenTime from '../models/ScreenTime.js';

class ScreenTimeService {
  static async getScreenTime(childId) {
    return await ScreenTime.findOne({ child: childId });
  }

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

  static async updateUsedTime(childId, timeSpent, isToday = true) {
    const screenTime = await ScreenTime.findOne({ child: childId });

    if (isToday) {
      screenTime.usedToday += timeSpent;
    } else {
      screenTime.usedThisWeek += timeSpent;
    }

    if (screenTime.usedToday > screenTime.dailyLimit || screenTime.usedThisWeek > screenTime.weeklyLimit) {
      screenTime.isBlocked = true;
    }

    await screenTime.save();
    return screenTime;
  }

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
