import React from "react";

interface BackButtonProps {
  onClick: () => void;
  disabled: boolean;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  disabled,
  className = "",
}) => {
  return (
    <button
      className={`px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      Back
    </button>
  );
};

export default BackButton;
