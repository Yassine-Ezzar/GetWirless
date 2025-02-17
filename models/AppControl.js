import mongoose from 'mongoose';

const applicationControlSchema = new mongoose.Schema(
  {
    child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    blacklist: { type: [String], default: [] }, 
    whitelist: { type: [String], default: [] }, 
    monitoredApps: { 
      type: Map, 
      of: Number, 
      default: {} 
    },
    appInstallRequests: { type: [String], default: [] }, 
    purchaseRestrictions: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);

const ApplicationControl = mongoose.model('ApplicationControl', applicationControlSchema);
export default ApplicationControl;
