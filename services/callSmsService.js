import CallSms from '../models/CallSms.js';
import { sendEmail } from '../utils/emailService.js';

export const logActivity = async (data) => {
  const activity = new CallSms(data);
  return await activity.save();
};

export const blockContact = async (childId, contactId) => {
  return await CallSms.updateMany(
    { childId, 'contact.numberOrId': contactId },
    { 'contact.isBlocked': true, 'contact.isSuspicious': true }
  );
};

export const getLogs = async (childId) => {
  return await CallSms.find({ childId }).sort({ timestamp: -1 });
};

export const sendAlert = async (childId, keywords, content) => {
  const parentEmail = 'yassine.ezzar@esprit.tn'; 
  const subject = 'Alert: Risky Content Detected';
  const message = `Risky keywords (${keywords.join(', ')}) found in: "${content}"`;
  
  await sendEmail(parentEmail, subject, message);
  
  await CallSms.updateOne(
    { childId, content },
    { alertSent: true }
  );
};