"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLoading from "@/components/auth/AuthLoading";

// Map of Auth.js error codes to user-friendly messages
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'OAuthCallback': 'Error during authentication. Please try again.',
  'OAuthSignin': 'Error starting authentication flow. Please try again.',
  'OAuthAccountNotLinked': 'This email is already associated with another account.',
  'AccessDenied': 'Authentication was denied.',
  'Verification': 'The verification link expired or has already been used.',
  'Configuration': 'There is a problem with the server configuration.',
  'CredentialsSignin': 'Sign in failed. Check your credentials.',
  'SessionRequired': 'Please sign in to access this page.',
  'CallbackRouteError': 'There was a problem with the authentication callback.',
  'EmailCreateAccount': 'Could not create email account.',
  'Default': 'An error occurred during authentication.',
};

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const authError = searchParams.get("error");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    // Set initial error from URL if present
    authError ? AUTH_ERROR_MESSAGES[authError] || AUTH_ERROR_MESSAGES.Default : null
  );

  // Handle GitHub sign-in
  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Sign in with GitHub provider using Auth.js
      await signIn("github", {
        callbackUrl,
        redirect: true,
      });
      // NextAuth will handle the redirect after successful sign-in
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  // If already authenticated, show loading state
  if (status === "authenticated") {
    return <AuthLoading message="Already signed in, redirecting..." size="large" />;
  }

  // If checking auth status, show loading state
  if (status === "loading") {
    return <AuthLoading message="Checking authentication status..." />;
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Welcome to Kana Flashcards
        </h1>
        <h2 className="mt-4 text-center text-xl leading-9 tracking-tight">
          Sign in to continue
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="flex w-full justify-center items-center rounded-md bg-gray-800 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:bg-gray-400"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Sign in with GitHub
              </>
            )}
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Practice Japanese kana characters with this flashcard app.
        </p>
      </div>
    </div>
  );
}
