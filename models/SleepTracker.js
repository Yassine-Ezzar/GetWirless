// models/SleepTracker.js
import mongoose from 'mongoose';

const sleepTrackerSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',  // Suppose que vous avez un modèle "Child" pour identifier l'enfant
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
    type: Number, // En heures
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

const SleepTracker = mongoose.model('SleepTracker', sleepTrackerSchema);
export default SleepTracker;
