import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthLoading from "./AuthLoading";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingMessage?: string;
}

/**
 * AuthGuard component - Client-side auth protection
 * Acts as a fallback to middleware protection and handles loading states
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback,
  loadingMessage = "Verifying authentication..."
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    isLoading, 
    isAuthenticated, 
    handleGitHubSignIn,
    refreshSession,
    authError
  } = useAuth({
    requireAuth: true, 
    redirectTo: "/login"
  });
  
  // Attempt to refresh session if auth error is detected
  useEffect(() => {
    if (authError) {
      console.warn("Auth error detected:", authError);
      // Try to refresh the session
      refreshSession().catch(e => {
        console.error("Failed to refresh session:", e);
        // If refresh fails, redirect to login
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      });
    }
  }, [authError, refreshSession, router, pathname]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return <AuthLoading message={loadingMessage} />;
  }

  // If authenticated, show the protected content
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, show fallback or default message
  if (fallback) {
    return <>{fallback}</>;
  }

  // Handle GitHub sign-in directly from the guard
  const onGitHubSignIn = () => {
    handleGitHubSignIn(pathname);
  };

  // Default fallback with GitHub sign-in option
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Authentication Required
      </h1>
      <p className="text-xl mb-6 max-w-2xl text-gray-600 dark:text-gray-300">
        Please sign in with GitHub to access this content.
      </p>
      {authError && (
        <p className="mb-6 text-red-500">
          Error: {authError}. Please try again.
        </p>
      )}
      <button
        onClick={onGitHubSignIn}
        className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
        Sign in with GitHub
      </button>
    </div>
  );
};

export default AuthGuard;
