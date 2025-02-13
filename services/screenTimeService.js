import mongoose from "mongoose";
import ScreenTime from "../models/ScreenTime.js";
import Child from "../models/Child.js";

/**
 * Créer ou mettre à jour le temps d’écran d’un enfant
 */
export const setScreenTime = async (childId, dailyLimit) => {
  return await ScreenTime.findOneAndUpdate(
    { childId },
    { dailyLimit },
    { upsert: true, new: true }
  );
};

export const getScreenTime = async (childId) => {
  if (!childId) {
    throw new Error("childId est requis.");
  }

  
  const child = await Child.findById(childId);
  if (!child) {
    throw new Error("Enfant non trouvé.");
  }

  
  const screenTime = await ScreenTime.findOne({ childId });
  if (!screenTime) {
    throw new Error("Aucune donnée de temps d'écran trouvée.");
  }

  return screenTime;
};




/**
 * Mettre à jour le temps d’écran utilisé
 */
export const updateUsedTime = async (childId, minutes) => {
  const screenTime = await ScreenTime.findOne({ childId });

  if (!screenTime) {
    throw new Error("Aucune donnée de temps d'écran trouvée.");
  }

  screenTime.usedTime += minutes;
  
  if (screenTime.usedTime > screenTime.dailyLimit) {
    throw new Error("Temps d’écran dépassé !");
  }

  return await screenTime.save();
};
