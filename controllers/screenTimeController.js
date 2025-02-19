import SleepTracker from '../models/SleepTracker.js';
import ScreenTimeLimit from '../models/ScreenTime.js';
import moment from 'moment';

class ScreenTimeController {
  static async getScreenTimeLimit(req, res) {
    try {
      const { childId } = req.params;
      const screenTimeLimit = await ScreenTimeLimit.findOne({ child: childId });
      if (!screenTimeLimit) return res.status(404).json({ message: "Aucune règle de gestion du temps d'écran trouvée." });
      return res.status(200).json(screenTimeLimit);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Réinitialiser le temps d'écran de l'enfant
  static async resetScreenTime(req, res) {
    try {
      const { childId } = req.params;

      // Réinitialiser le compteur de temps passé et la date de réinitialisation
      const screenTimeLimit = await ScreenTimeLimit.findOne({ child: childId });
      if (!screenTimeLimit) return res.status(404).json({ message: "Pas de règle de gestion du temps d'écran trouvée pour cet enfant." });

      screenTimeLimit.timeSpent = 0; // Réinitialiser le temps passé
      screenTimeLimit.lastReset = Date.now(); // Mettre à jour la date de réinitialisation

      await screenTimeLimit.save();

      return res.status(200).json({ message: "Temps d'écran réinitialisé avec succès." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


  static async updateScreenTimeLimit(req, res) {
    try {
      const { childId } = req.params;
      const { dailyLimit, usagePeriods, schoolMode, restrictedApps } = req.body;
      
      let screenTimeLimit = await ScreenTimeLimit.findOneAndUpdate(
        { child: childId },
        { dailyLimit, usagePeriods, schoolMode, restrictedApps },
        { new: true, upsert: true }
      );
      return res.status(200).json(screenTimeLimit);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async trackUsage(req, res) {
    try {
      const { childId } = req.params;
      const { timeSpent } = req.body; // Temps passé en minutes

      const screenTimeLimit = await ScreenTimeLimit.findOne({ child: childId });

      if (!screenTimeLimit) return res.status(404).json({ message: "Temps d'écran non configuré." });

      screenTimeLimit.timeSpent += timeSpent;
      if (screenTimeLimit.timeSpent > screenTimeLimit.dailyLimit) {
        // Block the device or certain apps
        // Here you could implement some sort of block functionality for the device
        return res.status(403).json({ message: "Limite de temps dépassée, appareil bloqué." });
      }

      await screenTimeLimit.save();
      return res.status(200).json(screenTimeLimit);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

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

  // Réinitialiser le temps d'écran d'un enfant
  static async resetScreenTime(childId) {
    const screenTimeLimit = await ScreenTimeLimit.findOne({ child: childId });
    if (!screenTimeLimit) throw new Error("Aucune règle de gestion du temps d'écran trouvée.");

    screenTimeLimit.timeSpent = 0; // Réinitialiser le temps passé
    screenTimeLimit.lastReset = Date.now(); // Réinitialiser la date
    await screenTimeLimit.save();

    return screenTimeLimit;
  }

  // Vérifier si l’enfant a dépassé la limite quotidienne
  static async isBlocked(childId) {
    const screenTimeLimit = await ScreenTimeLimit.findOne({ child: childId });
    if (!screenTimeLimit) return false;

    return screenTimeLimit.timeSpent >= screenTimeLimit.dailyLimit;
  }

  static async limitScreenBeforeBedtime(req, res) {
    try {
      const { childId } = req.params;
      const currentTime = moment().format('HH:mm');
      const screenTimeLimit = await ScreenTimeLimit.findOne({ child: childId });
      
      if (!screenTimeLimit) {
        return res.status(404).json({ message: "Aucune règle de gestion du temps d'écran trouvée." });
      }

      const bedtime = screenTimeLimit.bedtime || "22:00"; // Heure de coucher définie dans la règle
      if (moment(currentTime, 'HH:mm').isAfter(moment(bedtime, 'HH:mm'))) {
        // Limiter l'utilisation des applications
        screenTimeLimit.blockAppsBeforeBedtime = true;
        await screenTimeLimit.save();

        return res.status(200).json({ message: "Temps d'écran limité avant le coucher." });
      } else {
        return res.status(200).json({ message: "L'heure du coucher n'est pas encore atteinte." });
      }

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Suivi des habitudes de sommeil (Utilisation de SleepTracker)
  static async trackSleepPattern(req, res) {
    try {
      const { childId } = req.params;
      const { sleepStartTime, sleepEndTime } = req.body;

      const sleepData = new SleepTracker({
        child: childId,
        sleepStartTime,
        sleepEndTime,
        sleepDuration: moment(sleepEndTime).diff(moment(sleepStartTime), 'hours'),
        date: moment().format('YYYY-MM-DD')
      });

      await sleepData.save();

      return res.status(200).json({ message: "Habitudes de sommeil enregistrées avec succès." });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Alertes d’utilisation excessive
 // controllers/ScreenTimeController.js
static async alertExcessiveUsage(req, res) {
  try {
    const { childId, appName, maxUsageTime } = req.body;
    
    // Récupérer les limites de temps d'écran de l'enfant
    const screenTimeLimit = await ScreenTimeLimit.findOne({ child: childId });
    
    if (!screenTimeLimit) {
      return res.status(404).json({ message: "Aucune règle de gestion du temps d'écran trouvée." });
    }

    // Vérifier si la propriété appUsage existe dans screenTimeLimit
    const appUsage = screenTimeLimit.appUsage || {}; // Initialiser à un objet vide si appUsage est indéfini
    const appUsageTime = appUsage[appName] || 0; // Par défaut, mettre 0 si l'application n'est pas trouvée

    // Vérifier si l'usage de l'application dépasse le temps autorisé
    if (appUsageTime > maxUsageTime) {
      return res.status(200).json({
        message: `Alerte : L'enfant a dépassé le temps d'utilisation de ${appName}`,
        usageTime: appUsageTime
      });
    }

    return res.status(200).json({
      message: "Aucune alerte d'utilisation excessive."
    });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



}




export default ScreenTimeController;
