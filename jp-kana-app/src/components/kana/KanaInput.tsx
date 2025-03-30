import React, { RefObject, useEffect } from 'react';

interface KanaInputProps {
  inputValue: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  disabled: boolean;
  inputRef: RefObject<HTMLInputElement>;
}

const KanaInput: React.FC<KanaInputProps> = ({
  inputValue,
  onChange,
  onSubmit,
  disabled,
  inputRef
}) => {
  // Use effect to keep focus on the input field
  useEffect(() => {
    // Focus the input field on component mount and after every value change/reset
    if (inputRef.current && !disabled) {
      // Use a small delay to ensure DOM has updated completely
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
      
      return () => clearTimeout(focusTimer);
    }
  }, [inputValue, disabled, inputRef]);

  return (
    <form id="romanjiForm" onSubmit={onSubmit} className="flex flex-col items-center w-full max-w-md mx-auto mt-6">
      <label htmlFor="romanjiInput" className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">Enter Romanji:</label>
      <input
        type="text"
        id="romanjiInput"
        name="romanjiInput"
        placeholder="Type here..."
        value={inputValue}
        onChange={onChange}
        autoComplete="off"
        autoFocus
        disabled={disabled}
        ref={inputRef}
        className="w-full px-4 py-2 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-4"
      />
      <button 
        type="submit" 
        disabled={disabled}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </form>
  );
};

export default KanaInput; 