"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthLoading from "@/components/auth/AuthLoading";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { status, isLoading: sessionLoading, handleGitHubSignIn } = useAuth({
    redirectIfAuthenticated: true,
    redirectIfAuthenticatedTo: "/",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  // Parse error from URL if present
  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case "OAuthAccountNotLinked":
          setError("This account is already linked to another provider.");
          break;
        case "OAuthSignInError":
          setError("There was a problem signing in with GitHub.");
          break;
        case "OAuthCallback":
          setError("Error during GitHub sign-in callback.");
          break;
        case "EmailSignin":
          setError("The email couldn't be sent.");
          break;
        default:
          setError("An authentication error occurred. Please try again.");
      }
    }
  }, [errorParam]);

  const onGitHubSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await handleGitHubSignIn();
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (status === "loading" || sessionLoading) {
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
            onClick={onGitHubSignIn}
            disabled={isLoading}
            className="flex w-full justify-center items-center rounded-md bg-gray-800 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:bg-gray-400"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>Sign in with GitHub</>
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
