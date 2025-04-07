import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  id,
  label,
  disabled = false,
  className = '',
}) => {
  const uniqueId = id || `switch-${Math.random().toString(36).substring(2, 9)}`;

  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative inline-block">
        <input
          type="checkbox"
          id={uniqueId}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
        <div
          onClick={handleChange}
          className={`block w-10 h-6 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
            disabled ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' :
            checked ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <div
            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
              checked ? 'transform translate-x-4' : ''
            }`}
          />
        </div>
      </div>
      {label && (
        <label
          htmlFor={uniqueId}
          className={`ml-3 text-sm ${
            disabled ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Switch; 