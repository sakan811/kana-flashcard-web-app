import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component - Central component for authentication protection
 * This handles all protected route logic on the client side
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  // Force session refresh when component mounts or status changes
  useEffect(() => {
    if (status === "authenticated") {
      console.log("Refreshing auth session...");
      update();
    }
  }, [status, update]);
  
  // Effect to handle unauthenticated state
  useEffect(() => {
    // Only redirect if definitively not authenticated (not during "loading" state)
    if (status === "unauthenticated") {
      // Set callback URL for return after authentication
      const callbackUrl = encodeURIComponent(pathname);
      
      // Redirect to login page, but avoid redirect if already on login page
      if (!pathname.includes("/login")) {
        console.log(`User not authenticated, redirecting to login with callback to ${pathname}`);
        router.push(`/login?callbackUrl=${callbackUrl}`);
      }
    }
  }, [status, router, pathname]);

  // While checking auth status, show loading
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-xl text-gray-600 dark:text-gray-300">Verifying authentication...</p>
      </div>
    );
  }

  // If authenticated, show the protected content
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // During redirect, show a message (this is shown briefly before the redirect happens)
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
