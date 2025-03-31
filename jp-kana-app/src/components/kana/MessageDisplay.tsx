import React from "react";
import { KanaMessage } from "@/types";

interface MessageDisplayProps {
  message: KanaMessage;
  hasError: boolean;
  onRetry: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  message,
  hasError,
  onRetry,
}) => {
  if (!message.correct && !message.incorrect && !message.error) {
    return null;
  }

  return (
    <div className="mt-4">
      {message.correct && (
        <p className="text-green-600 dark:text-green-400 font-medium text-lg text-center">
          {message.correct}
        </p>
      )}
      {message.incorrect && (
        <p
          className="text-red-600 dark:text-red-400 font-medium text-lg text-center"
          dangerouslySetInnerHTML={{ __html: message.incorrect }}
        />
      )}
      {message.error && (
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium text-lg">
            {message.error}
          </p>
          {hasError && (
            <button
              onClick={onRetry}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageDisplay;
