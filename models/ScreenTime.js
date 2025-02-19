
import mongoose from 'mongoose';

const screenTimeLimitSchema = new mongoose.Schema(
  {
    child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    dailyLimit: { type: Number, default: 120 }, // Limit en minutes (ex: 120 minutes)
    usagePeriods: [
      {
        dayOfWeek: { type: String, required: true }, // ex: 'lundi', 'mardi', etc.
        start: { type: Date, required: true },
        end: { type: Date, required: true },
      },
    ],
    schoolMode: {
      active: { type: Boolean, default: false },
      blockedApps: { type: [String], default: [] }, // Liste des apps à bloquer pendant le mode école
    },
    restrictedApps: { type: [String], default: [] }, // Liste des apps à bloquer globalement
    timeSpent: { type: Number, default: 0 }, // Temps passé aujourd'hui en minutes
    lastReset: { type: Date, default: Date.now }, // Date de réinitialisation des minutes
  },
  { timestamps: true }
);

const ScreenTimeLimit = mongoose.model('ScreenTimeLimit', screenTimeLimitSchema);
export default ScreenTimeLimit;
