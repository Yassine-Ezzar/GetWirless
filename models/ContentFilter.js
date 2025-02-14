import mongoose from 'mongoose';

const contentFilterSchema = new mongoose.Schema(
  {
    child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    blacklist: { type: [String], default: [] },
    whitelist: { type: [String], default: [] },
    blockedCategories: { type: [String], default: [] },
  },
  { timestamps: true }
);

const ContentFilter = mongoose.model('ContentFilter', contentFilterSchema);
export default ContentFilter;
