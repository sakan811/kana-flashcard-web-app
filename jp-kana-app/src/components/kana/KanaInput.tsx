import React, { RefObject } from 'react';

interface KanaInputProps {
  inputValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
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
  return (
    <form id="romanjiForm" onSubmit={onSubmit}>
      <label htmlFor="romanjiInput" className="inputTitle">Enter Romanji:</label>
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
      />
      <button 
        type="submit" 
        disabled={disabled}
      >
        Submit
      </button>
    </form>
  );
};

export default KanaInput; 