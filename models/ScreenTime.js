import mongoose from 'mongoose';

const screenTimeSchema = new mongoose.Schema(
  {
    child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    dailyLimit: { type: Number, required: true },
    weeklyLimit: { type: Number, required: true },  
    usedToday: { type: Number, default: 0 }, 
    usedThisWeek: { type: Number, default: 0 }, 
    isBlocked: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

const ScreenTime = mongoose.model('ScreenTime', screenTimeSchema);

export default ScreenTime;
