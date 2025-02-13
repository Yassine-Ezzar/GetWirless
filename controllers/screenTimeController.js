import { setScreenTime, getScreenTime, updateUsedTime } from "../services/screenTimeService.js";
import Child from "../models/Child.js";


export const setScreenTimeLimit = async (req, res) => {
  try {
    console.log("BODY RECU :", req.body); // Debugging

    const { childId, dailyLimit } = req.body;
    if (!childId || !dailyLimit) {
      return res.status(400).json({ error: "childId et dailyLimit sont requis." });
    }

    const screenTime = await setScreenTime(childId, dailyLimit);
    res.status(200).json({ message: "Temps d’écran mis à jour.", screenTime });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getScreenTimeInfo = async (req, res) => {
  try {
    console.log("Paramètres reçus :", req.params); // Debugging

    const { childId } = req.params;
    if (!childId) {
      return res.status(400).json({ error: "childId est requis." });
    }

    console.log("Recherche du temps d'écran pour l'enfant :", childId); // Debugging
    const screenTime = await getScreenTime(childId); // Appel du service
    res.status(200).json({ screenTime });
  } catch (error) {
    console.error("Erreur lors de la récupération du temps d'écran :", error); // Debugging
    res.status(500).json({ error: error.message });
  }
};;


/**
 * Mettre à jour le temps utilisé
 */
export const addUsedScreenTime = async (req, res) => {
  try {
    const { childId, minutes } = req.body;
    const updatedScreenTime = await updateUsedTime(childId, minutes);
    res.status(200).json({ message: "Temps utilisé mis à jour", updatedScreenTime });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
