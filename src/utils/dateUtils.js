// utils/dateUtils.js
import { format, parseISO, isValid } from 'date-fns';

// Format date to display format
export const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid Date';
};

// Get date range for last N days
export const getLastNDaysRange = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd')
  };
};