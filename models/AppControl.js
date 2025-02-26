import mongoose from 'mongoose';

const AppControlSchema = new mongoose.Schema({
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
    blockedApps: [{ type: String }], // Liste des applications bloquées
    pendingApps: [{
        name: String,
        requestedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' }
    }]
}, { timestamps: true });

export default mongoose.model('AppControl', AppControlSchema);