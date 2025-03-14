// client/src/utils/formatters.js
import moment from 'moment';

export const formatDate = (date, format = 'YYYY-MM-DD') => {
  return moment(date).format(format);
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
