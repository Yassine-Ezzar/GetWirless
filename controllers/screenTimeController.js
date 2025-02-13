// controllers/screenTimeController.js
import ScreenTimeService from '../services/screenTimeService.js';

class ScreenTimeController {
  // Récupère les règles de temps d'écran d'un enfant
  static async getScreenTime(req, res) {
    try {
      const { childId } = req.params;
      const screenTime = await ScreenTimeService.getScreenTime(childId);
      if (!screenTime) {
        return res.status(404).json({ message: 'Temps d\'écran non trouvé pour cet enfant.' });
      }
      return res.status(200).json(screenTime);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Crée ou met à jour les règles de temps d'écran d'un enfant
  static async setScreenTime(req, res) {
    try {
      const { childId } = req.params;
      const { dailyLimit, weeklyLimit } = req.body;

      if (!dailyLimit || !weeklyLimit) {
        return res.status(400).json({ message: 'Les limites quotidiennes et hebdomadaires sont requises.' });
      }

      const screenTime = await ScreenTimeService.setScreenTime(childId, dailyLimit, weeklyLimit);
      return res.status(200).json(screenTime);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Met à jour le temps d'écran utilisé
  static async updateUsedTime(req, res) {
    try {
      const { childId } = req.params;
      const { timeSpent, isToday } = req.body;

      if (!timeSpent) {
        return res.status(400).json({ message: 'Le temps passé est requis.' });
      }

      const screenTime = await ScreenTimeService.updateUsedTime(childId, timeSpent, isToday);
      return res.status(200).json(screenTime);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Réinitialise le temps d'écran
  static async resetScreenTime(req, res) {
    try {
      const { childId } = req.params;
      const screenTime = await ScreenTimeService.resetScreenTime(childId);
      return res.status(200).json(screenTime);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default ScreenTimeController;
