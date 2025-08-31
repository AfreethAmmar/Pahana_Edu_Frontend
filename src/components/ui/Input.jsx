import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  hint,
  type = 'text',
  placeholder,
  className = '',
  required = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const baseInputStyles = 'block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200 py-3 px-4 bg-white hover:shadow-md';
  const errorStyles = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
  const disabledStyles = disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '';
  
  const iconStyles = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
  
  const inputClasses = [
    baseInputStyles,
    errorStyles,
    disabledStyles,
    iconStyles,
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
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">{icon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">{icon}</span>
          </div>
        )}
      </div>
      
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

Input.displayName = 'Input';

export default Input;