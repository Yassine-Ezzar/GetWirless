// utils/timeUtils.js
import moment from 'moment';

export const checkIfWithinUsagePeriod = (usagePeriods) => {
  const currentDay = moment().format('dddd').toLowerCase(); // Exemple : 'lundi'
  const currentTime = moment();

  const period = usagePeriods.find(period => period.dayOfWeek === currentDay);
  if (!period) return true; // Si pas de période spécifiée pour ce jour, on autorise l'utilisation

  const start = moment(period.start);
  const end = moment(period.end);

  return currentTime.isBetween(start, end);
};
