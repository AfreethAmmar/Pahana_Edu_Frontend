import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
  onClick,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const baseStyles = 'bg-white border border-gray-200 rounded-lg';
  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  const cardClasses = [
    baseStyles,
    paddings[padding],
    shadows[shadow],
    hoverStyles,
    clickableStyles,
    className
  ].join(' ');

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 pb-3 mb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 pt-3 mt-4 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;