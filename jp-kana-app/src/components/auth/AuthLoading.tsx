import React from "react";

type AuthLoadingProps = {
  message?: string;
  size?: "small" | "medium" | "large";
};

/**
 * Loading indicator for authentication states
 * Provides consistent loading states across the application
 */
const AuthLoading = ({ 
  message = "Verifying authentication...", 
  size = "medium" 
}: AuthLoadingProps) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-2",
    large: "h-12 w-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} border-b-blue-500`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          {message}
        </p>
      )}
    </div>
  );
};

export default AuthLoading;