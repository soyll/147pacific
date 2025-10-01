import React from 'react';
import { ButtonProps } from '@/types';
import { cn } from '@/utils';

export const Button: React.FC<ButtonProps> = React.memo(({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  className,
  ...props
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const buttonClasses = cn(
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full' : '',
    loading ? 'button--loading' : '',
    disabled ? 'button--disabled' : '',
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="sr-only">Loading...</span>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';
