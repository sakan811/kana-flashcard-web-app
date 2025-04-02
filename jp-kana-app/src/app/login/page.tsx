"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  
  // Get callbackUrl from URL parameters or default to homepage
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Effect to handle authenticated users
  useEffect(() => {
    // If already authenticated, navigate to the callback URL
    if (status === "authenticated") {
      console.log("Already authenticated. Navigating to:", callbackUrl);

      // If it's an absolute URL, use direct navigation
      if (callbackUrl.startsWith('http')) {
        window.location.href = callbackUrl;
      } else {
        // For relative URLs, use Next.js router
        router.replace(callbackUrl);
      }
    }
  }, [status, callbackUrl, router]);

  // Handle errors from the URL
  useEffect(() => {
    const errorMessage = searchParams.get("error");
    if (errorMessage) {
      setError(`Authentication error: ${errorMessage}`);
      setIsLoading(false);
    }
  }, [searchParams]);

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    try {
      // Use redirect: true to let NextAuth handle the flow directly
      await signIn("github", {
        callbackUrl,
        redirect: true,
      });
      // No need for post-sign-in logic here as NextAuth will handle the redirect
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  // If already authenticated, show loading state
  if (status === "authenticated") {
    return (
      <div className="flex min-h-[80vh] flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Already signed in, redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Welcome to Kana Flashcards
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in with GitHub to get started. New users will be automatically registered.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className="mb-4 p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading || status === "loading"}
            className="flex w-full justify-center items-center gap-3 rounded-md bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-semibold leading-6">
              {isLoading ? "Signing in..." : "Continue with GitHub"}
            </span>
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
