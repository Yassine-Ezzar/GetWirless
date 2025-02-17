import ApplicationControlService from '../services/appControlService.js';

class ApplicationControlController {
  static async getControl(req, res) {
    try {
      const { childId } = req.params;
      const control = await ApplicationControlService.getControl(childId);
      if (!control) return res.status(404).json({ message: "Aucune règle trouvée." });
      return res.status(200).json(control);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateLists(req, res) {
    try {
      const { childId } = req.params;
      const { blacklist, whitelist } = req.body;
      const control = await ApplicationControlService.updateLists(childId, blacklist, whitelist);
      return res.status(200).json(control);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async logUsage(req, res) {
    try {
      const { childId } = req.params;
      const { appName, minutes } = req.body;
      const control = await ApplicationControlService.logUsage(childId, appName, minutes);
      return res.status(200).json(control);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async requestInstall(req, res) {
    try {
      const { childId } = req.params;
      const { appName } = req.body;
      const control = await ApplicationControlService.requestInstall(childId, appName);
      return res.status(200).json(control);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async approveInstall(req, res) {
    try {
      const { childId } = req.params;
      const { appName } = req.body;
      const control = await ApplicationControlService.approveInstall(childId, appName);
      return res.status(200).json(control);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async togglePurchaseRestriction(req, res) {
    try {
      const { childId } = req.params;
      const { status } = req.body;
      const control = await ApplicationControlService.togglePurchaseRestriction(childId, status);
      return res.status(200).json(control);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default ApplicationControlController;
