import React from 'react';

const Loading = ({
  size = 'md',
  color = 'blue',
  text,
  fullScreen = false,
  className = ''
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    amber: 'text-amber-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600'
  };

  const spinner = (
    <svg
      className={`animate-spin ${sizes[size]} ${colors[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          {spinner}
          {text && (
            <p className="text-gray-600 text-sm font-medium">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        {spinner}
        {text && (
          <p className="text-gray-600 text-sm font-medium">{text}</p>
        )}
      </div>
    </div>
  );
};

const LoadingCard = ({ className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

const LoadingTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
    <div className="animate-pulse">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array(columns).fill(0).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
          ))}
        </div>
      </div>
      {Array(rows).fill(0).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
          <div className="flex space-x-4">
            {Array(columns).fill(0).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 rounded flex-1"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LoadingGrid = ({ items = 6, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
    {Array(items).fill(0).map((_, index) => (
      <LoadingCard key={index} />
    ))}
  </div>
);

Loading.Card = LoadingCard;
Loading.Table = LoadingTable;
Loading.Grid = LoadingGrid;

export default Loading;