import React, { useState } from 'react';

const FilterDropdown = ({
  options = [],
  selectedValues = [],
  onSelectionChange,
  placeholder = 'Filter...',
  multiSelect = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value) => {
    if (multiSelect) {
      const newSelection = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange(selectedValues.includes(value) ? [] : [value]);
      setIsOpen(false);
    }
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const option = options.find(o => o.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate text-gray-700">
          {getDisplayText()}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {selectedValues.length > 0 && (
              <div className="px-3 py-2 border-b border-gray-200">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={clearAll}
                >
                  Clear all
                </button>
              </div>
            )}
            
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                    isSelected ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                  }`}
                  onClick={() => handleOptionClick(option.value)}
                >
                  <span className={`block truncate ${isSelected ? 'font-medium' : 'font-normal'}`}>
                    {option.label}
                  </span>
                  
                  {isSelected && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>
              );
            })}
            
            {options.length === 0 && (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No options available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterDropdown;