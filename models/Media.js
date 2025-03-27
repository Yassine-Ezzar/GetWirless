import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  platform: {
    type: String,
    enum: ['youtube', 'tiktok', 'instagram', 'other'],
    required: true,
  },
  videoId: {
    type: String, 
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  watchCount: {
    type: Number,
    default: 1, 
  },
  isBlocked: {
    type: Boolean,
    default: false, 
  },
  flaggedReason: {
    type: String, 
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Media', MediaSchema);