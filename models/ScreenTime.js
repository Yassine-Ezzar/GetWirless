import mongoose from "mongoose";

const screenTimeSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
    required: true,
  },
  dailyLimit: {
    type: Number, // Temps en minutes
    required: true,
  },
  usedTime: {
    type: Number,
    default: 0, // Temps déjà utilisé dans la journée
  },
  startTime: {
    type: Date, // Heure de début d'utilisation
  },
  endTime: {
    type: Date, // Heure de fin d'utilisation
  },
  status: {
    type: String,
    enum: ["active", "blocked"], // Statut du contrôle
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ScreenTime", screenTimeSchema);
