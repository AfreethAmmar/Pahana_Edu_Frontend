import React from 'react';
import Badge from './Badge';
import { getStockStatus, getStockStatusText } from '../../utils/helpers';

const StockBadge = ({ quantity, threshold = 5 }) => {
  const status = getStockStatus(quantity);
  const text = getStockStatusText(quantity);

  const getVariant = () => {
    if (quantity === 0) return 'danger';
    if (quantity <= threshold) return 'warning';
    return 'success';
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={getVariant()}>
        {text}
      </Badge>
      <span className="text-sm text-gray-600">
        ({quantity} in stock)
      </span>
    </div>
  );
};

export default StockBadge;