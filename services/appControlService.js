import ApplicationControl from '../models/AppControl.js';

class ApplicationControlService {
  static async getControl(childId) {
    return await ApplicationControl.findOne({ child: childId });
  }

  static async updateLists(childId, blacklist, whitelist) {
    return await ApplicationControl.findOneAndUpdate(
      { child: childId },
      { blacklist, whitelist },
      { new: true, upsert: true }
    );
  }

  static async logUsage(childId, appName, minutes) {
    const control = await ApplicationControl.findOne({ child: childId });
    if (!control) throw new Error("Aucune règle trouvée.");

    control.monitoredApps.set(appName, (control.monitoredApps.get(appName) || 0) + minutes);
    return await control.save();
  }

  static async requestInstall(childId, appName) {
    return await ApplicationControl.findOneAndUpdate(
      { child: childId },
      { $addToSet: { appInstallRequests: appName } },
      { new: true, upsert: true }
    );
  }

  static async approveInstall(childId, appName) {
    return await ApplicationControl.findOneAndUpdate(
      { child: childId },
      { $pull: { appInstallRequests: appName }, $addToSet: { whitelist: appName } },
      { new: true }
    );
  }

  static async togglePurchaseRestriction(childId, status) {
    return await ApplicationControl.findOneAndUpdate(
      { child: childId },
      { purchaseRestrictions: status },
      { new: true }
    );
  }
}

export default ApplicationControlService;
