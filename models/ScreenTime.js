
import mongoose from 'mongoose';

const screenTimeLimitSchema = new mongoose.Schema(
  {
    child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    dailyLimit: { type: Number, default: 120 }, 
    usagePeriods: [
      {
        dayOfWeek: { type: String, required: true }, 
        start: { type: Date, required: true },
        end: { type: Date, required: true },
      },
    ],
    schoolMode: {
      active: { type: Boolean, default: false },
      blockedApps: { type: [String], default: [] }, 
    },
    restrictedApps: { type: [String], default: [] }, 
    timeSpent: { type: Number, default: 0 }, 
    lastReset: { type: Date, default: Date.now }, 
  },
  { timestamps: true }
);

const ScreenTimeLimit = mongoose.model('ScreenTimeLimit', screenTimeLimitSchema);
export default ScreenTimeLimit;
