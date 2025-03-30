import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, disabled }) => {
  return (
    <button 
      className="backButton" 
      onClick={onClick}
      disabled={disabled}
    >
      Back
    </button>
  );
};

export default BackButton; 