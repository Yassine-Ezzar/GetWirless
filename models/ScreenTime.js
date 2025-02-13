// models/ScreenTime.js
import mongoose from 'mongoose';

const screenTimeSchema = new mongoose.Schema(
  {
    child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    dailyLimit: { type: Number, required: true },  // Limite quotidienne en minutes
    weeklyLimit: { type: Number, required: true },  // Limite hebdomadaire en minutes
    usedToday: { type: Number, default: 0 }, // Temps d'écran utilisé aujourd'hui
    usedThisWeek: { type: Number, default: 0 }, // Temps d'écran utilisé cette semaine
    isBlocked: { type: Boolean, default: false }, // Si l'accès est bloqué
  },
  { timestamps: true }
);

const ScreenTime = mongoose.model('ScreenTime', screenTimeSchema);

export default ScreenTime;
