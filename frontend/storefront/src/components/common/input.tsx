import React, { forwardRef } from 'react';
import { InputProps } from '@/types';
import { cn } from '@/utils';

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className,
  label,
  id,
  ...props
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = cn(
    'input',
    error ? 'input--error' : undefined,
    disabled ? 'input--disabled' : undefined,
    className
  );

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className={inputClasses}>
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className="input__field"
          {...props}
        />
        {error && (
          <div id={`${inputId}-error`} className="input__error" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

