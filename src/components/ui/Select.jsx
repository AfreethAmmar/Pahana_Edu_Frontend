import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  error,
  hint,
  options = [],
  placeholder = 'Select an option',
  className = '',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const baseSelectStyles = 'block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200 py-3 px-4 bg-white hover:shadow-md';
  const errorStyles = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
  const disabledStyles = disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '';
  
  const selectClasses = [
    baseSelectStyles,
    errorStyles,
    disabledStyles,
    className
  ].join(' ');

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        className={selectClasses}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option, index) => (
          <option
            key={option.value || index}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p id={`${props.id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;