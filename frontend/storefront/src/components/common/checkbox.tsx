import React from 'react';

interface CheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked = false,
  disabled = false,
  onChange,
  children,
  className = ''
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <label className={`checkbox ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        className="checkbox__input"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className="checkbox__checkmark">
        <svg className="icon">
          <use xlinkHref="/assets/images/sprite.svg#check"></use>
        </svg>
      </span>
      <span className="checkbox__text text text--middle text--semibold">
        {children}
      </span>
    </label>
  );
};
