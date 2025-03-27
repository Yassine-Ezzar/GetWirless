import * as callSmsService from '../services/callSmsService.js';
import { detectRiskyKeywords } from '../utils/helpers.js';

export const logCallOrMessage = async (req, res, next) => {
  try {
    const { childId, type, direction, contact, content, timestamp } = req.body;
    
    const flaggedKeywords = content ? detectRiskyKeywords(content) : [];
    
    const data = {
      childId,
      type,
      direction,
      contact,
      content,
      timestamp,
      flaggedKeywords,
    };
    
    const result = await callSmsService.logActivity(data);
    if (flaggedKeywords.length > 0) {
      await callSmsService.sendAlert(childId, flaggedKeywords, content);
    }
    
    res.status(201).json({ message: 'Activity logged', data: result });
  } catch (error) {
    next(error);
  }
};

export const blockContact = async (req, res, next) => {
  try {
    const { childId, contactId } = req.body;
    const updated = await callSmsService.blockContact(childId, contactId);
    res.status(200).json({ message: 'Contact blocked', data: updated });
  } catch (error) {
    next(error);
  }
};

export const getCallSmsLogs = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const logs = await callSmsService.getLogs(childId);
    res.status(200).json({ data: logs });
  } catch (error) {
    next(error);
  }
};