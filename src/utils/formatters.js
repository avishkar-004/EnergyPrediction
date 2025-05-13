// utils/formatters.js
// Format number to include thousands separators
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Format currency
export const formatCurrency = (num) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num);
};

// Format percentage
export const formatPercentage = (num) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(num / 100);
};