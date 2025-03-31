import React from "react";

interface MessageDisplayProps {
  error: string;
  hasError: boolean;
  onRetry: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  error,
  hasError,
  onRetry,
}) => {
  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline"> {error}</span>
      {hasError && (
        <div className="mt-2 flex justify-center">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={onRetry}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageDisplay;
