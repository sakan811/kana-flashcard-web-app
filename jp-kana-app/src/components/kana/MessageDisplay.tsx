import React from 'react';

interface MessageDisplayProps {
  error: string;
  hasError: boolean;
  onRetry: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  error,
  hasError,
  onRetry
}) => {
  if (!error) return null;

  return (
    <div className="error-message">
      <strong className="error-message-title">Error:</strong>
      <span className="error-message-content"> {error}</span>
      {hasError && (
        <button 
          className="retry-button" 
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default MessageDisplay; 