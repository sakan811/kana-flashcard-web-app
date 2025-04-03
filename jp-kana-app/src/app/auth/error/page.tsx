"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

/**
 * Error page for Auth.js
 * This provides helpful debugging information for auth errors
 */
export default function AuthError() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);

  useEffect(() => {
    // Extract error information from URL params
    const errorType = searchParams.get("error");
    
    if (errorType) {
      setError(errorType);
      
      // Provide helpful details based on error type
      switch (errorType) {
        case "Configuration":
          setDetails("There is a problem with the server configuration.");
          break;
        case "AccessDenied":
          setDetails("You don't have permission to access this resource.");
          break;
        case "Verification":
          setDetails("The verification token has expired or has already been used.");
          break;
        case "OAuthSignin":
          setDetails("Error occurred while constructing the authorization URL.");
          break;
        case "OAuthCallback":
          setDetails("Error occurred while handling the OAuth callback.");
          break;
        case "OAuthCreateAccount":
          setDetails("Could not create an OAuth account.");
          break;
        case "OAuthAccountNotLinked":
          setDetails("This account is already linked to another provider.");
          break;
        case "EmailCreateAccount":
          setDetails("Could not create an email account.");
          break;
        case "SessionRequired":
          setDetails("The content of this page requires you to be signed in.");
          break;
        case "Default":
        default:
          setDetails("An unspecified error occurred during authentication.");
          break;
      }
    }
  }, [searchParams]);

  if (!error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">No Error Information</h1>
        <p className="mb-4">No error details were provided.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
          Authentication Error
        </h1>
        
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 rounded">
          <p className="font-bold">Error Type: {error}</p>
          {details && <p className="mt-2">{details}</p>}
        </div>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Common Solutions:</h2>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Check if the OAuth provider is configured correctly</li>
              <li>Verify that your environment variables are set correctly</li>
              <li>Make sure your callback URLs are properly registered</li>
              <li>Check your network connectivity</li>
            </ul>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline mr-4">
              Try Again
            </Link>
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 