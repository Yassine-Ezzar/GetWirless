import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'alert'], 
    required: true,
  },
  summary: {
    type: Object, 
    default: {},
  },
  details: {
    type: String, 
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isSent: {
    type: Boolean,
    default: false, 
  },
});

export default mongoose.model('Report', ReportSchema);