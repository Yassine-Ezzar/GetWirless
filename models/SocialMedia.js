import mongoose from 'mongoose';

const SocialMediaSchema = new mongoose.Schema({
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
  activityType: {
    type: String,
    enum: ['post', 'message', 'interaction', 'search'],
    required: true,
  },
  content: {
    type: String,
    default: null, 
  },
  interactedWith: {
    username: String,
    isSuspicious: { type: Boolean, default: false }, 
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  flaggedKeywords: [String], 
  alertSent: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('SocialMedia', SocialMediaSchema);