import mongoose from 'mongoose';

const GeolocationSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isSos: {
    type: Boolean,
    default: false, //  alerte SOS
  },
});

const SafeZoneSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  name: {
    type: String, //  "Maison", "École"
    required: true,
  },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  radius: {
    type: Number, // Rayon en mètres
    required: true,
  },
});

export const Geolocation = mongoose.model('Geolocation', GeolocationSchema);
export const SafeZone = mongoose.model('SafeZone', SafeZoneSchema);