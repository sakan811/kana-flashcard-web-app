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

  // If not authenticated, show fallback or redirect (handled by useAuth)
  return fallback ? <>{fallback}</> : null;
};

export default AuthGuard;
