
import React from 'react';

interface ToggleSwitchProps {
  isEnabled: boolean;
  onToggle: (isEnabled: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isEnabled, onToggle, disabled = false }) => {
  const handleToggle = () => {
    if (!disabled) {
      onToggle(!isEnabled);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEnabled}
      onClick={handleToggle}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${isEnabled ? 'bg-indigo-600' : 'bg-gray-200'}
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
};

export default ToggleSwitch;
