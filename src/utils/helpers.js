import { STOCK_STATUS, LOW_STOCK_THRESHOLD } from './constants';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const formatDateShort = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

export const getStockStatus = (quantity) => {
  if (quantity === 0) return STOCK_STATUS.OUT_OF_STOCK;
  if (quantity <= LOW_STOCK_THRESHOLD) return STOCK_STATUS.LOW_STOCK;
  return STOCK_STATUS.IN_STOCK;
};

export const getStockStatusColor = (status) => {
  switch (status) {
    case STOCK_STATUS.IN_STOCK:
      return 'text-green-600 bg-green-100';
    case STOCK_STATUS.LOW_STOCK:
      return 'text-amber-600 bg-amber-100';
    case STOCK_STATUS.OUT_OF_STOCK:
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getStockStatusText = (quantity) => {
  const status = getStockStatus(quantity);
  switch (status) {
    case STOCK_STATUS.IN_STOCK:
      return 'In Stock';
    case STOCK_STATUS.LOW_STOCK:
      return 'Low Stock';
    case STOCK_STATUS.OUT_OF_STOCK:
      return 'Out of Stock';
    default:
      return 'Unknown';
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatEnumValue = (value) => {
  return value
    .split('_')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const sortArray = (array, sortBy, sortOrder = 'asc') => {
  return [...array].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortOrder === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
};

export const filterArray = (array, filters) => {
  return array.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key];
      const itemValue = item[key];
      
      if (!filterValue) return true;
      
      if (typeof filterValue === 'string') {
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      
      return itemValue === filterValue;
    });
  });
};

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const hasPermission = (userRole, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return requiredRoles.includes(userRole);
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const isOnline = () => {
  return navigator.onLine;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

export const getRandomColor = () => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};