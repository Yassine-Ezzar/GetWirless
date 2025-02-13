// models/ContentFilter.js
import mongoose from 'mongoose';

const contentFilterSchema = new mongoose.Schema(
  {
    child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    blacklist: { type: [String], default: [] }, // Liste des sites interdits
    whitelist: { type: [String], default: [] }, // Liste des sites autorisés
    blockedCategories: { type: [String], default: [] }, // Catégories interdites (ex: "adult", "gambling")
  },
  { timestamps: true }
);

const ContentFilter = mongoose.model('ContentFilter', contentFilterSchema);

export default ContentFilter;
