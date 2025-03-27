import mongoose from 'mongoose';

const sleepTrackerSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',  
    required: true
  },
  sleepStartTime: {
    type: String,
    required: true
  },
  sleepEndTime: {
    type: String,
    required: true
  },
  sleepDuration: {
    type: Number, 
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

const SleepTracker = mongoose.model('SleepTracker', sleepTrackerSchema);
export default SleepTracker;
