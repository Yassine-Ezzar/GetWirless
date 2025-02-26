import mongoose from 'mongoose';

const CallSmsSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  type: {
    type: String,
    enum: ['call', 'sms', 'whatsapp', 'messenger', 'instagram'],
    required: true,
  },
  direction: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: true,
  },
  contact: {
    name: String,
    numberOrId: String, // Phone number or app-specific ID
    isBlocked: { type: Boolean, default: false },
    isSuspicious: { type: Boolean, default: false },
  },
  content: {
    type: String, 
    default: null,
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

export default mongoose.model('CallSms', CallSmsSchema);