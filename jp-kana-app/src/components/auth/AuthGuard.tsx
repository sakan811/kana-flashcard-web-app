import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import AuthLoading from "./AuthLoading";

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  // Handle redirection when authentication state changes
  useEffect(() => {
    if (status === "unauthenticated" && !pathname.includes("/login")) {
      const callbackUrl = encodeURIComponent(pathname);
      router.replace(`/login?callbackUrl=${callbackUrl}`);
    }
  }, [status, router, pathname]);

  // Show loading state while checking auth
  if (status === "loading") {
    return <AuthLoading message={loadingMessage} />;
  }

  // If authenticated, show the protected content
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // If not authenticated, show fallback or default message
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback during transition to login page
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Authentication Required
      </h1>
      <p className="text-xl mb-6 max-w-2xl text-gray-600 dark:text-gray-300">
        Please sign in to access this content.
      </p>
      <div className="animate-pulse">
        <p className="text-blue-500">Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default AuthGuard;
