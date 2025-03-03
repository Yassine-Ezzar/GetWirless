import mongoose from 'mongoose';

const SocialMediaTimeSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  platform: {
    type: String,
    enum: ['facebook', 'instagram', 'tiktok', 'snapchat'],
    required: true,
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
  dailyLimit: {
    type: Number, 
    default: 60, 
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('SocialMediaTime', SocialMediaTimeSchema);