import React from "react";
import { KanaMessageState } from "@/hooks/useKanaState";

interface MessageDisplayProps {
  message: KanaMessageState;
  hasError: boolean;
  onRetry: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  message,
  hasError,
  onRetry,
}) => {
  if (!message.text) {
    return null;
  }

  return (
    <div className="mt-4">
      {message.type === "success" && (
        <p className="text-green-600 dark:text-green-400 font-medium text-lg text-center">
          {message.text}
        </p>
      )}
      {message.type === "error" && !hasError && (
        <p
          className="text-red-600 dark:text-red-400 font-medium text-lg text-center"
          dangerouslySetInnerHTML={{ __html: message.text }}
        />
      )}
      {hasError && (
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium text-lg">
            {message.text}
          </p>
          <button
            onClick={onRetry}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageDisplay;
