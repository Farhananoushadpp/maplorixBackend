// Utility functions for formatting data

export const formatSalary = (salary) => {
  if (!salary) return 'Not specified';
  
  if (typeof salary === 'string') {
    try {
      salary = JSON.parse(salary);
    } catch (e) {
      return salary;
    }
  }
  
  if (typeof salary === 'object' && salary !== null) {
    const { min, max, currency = 'USD' } = salary;
    
    if (min && max) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `${formatter.format(min)}+`;
    } else if (max) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return `Up to ${formatter.format(max)}`;
    } else if (currency) {
      return currency;
    }
  }
  
  return 'Not specified';
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'Invalid date';
  }
};

export const formatText = (text) => {
  if (!text || text === undefined || text === null) {
    return 'Not specified';
  }
  return text;
};
