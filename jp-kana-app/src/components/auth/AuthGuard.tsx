import React from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthLoading from "./AuthLoading";
import { useSession } from "next-auth/react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingMessage?: string;
}

/**
 * AuthGuard component - Simplified client-side auth protection
 * Directly uses useSession from next-auth for better compatibility with Auth.js v5
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback,
  loadingMessage = "Verifying authentication..."
}) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  
  // Show loading state while checking auth
  if (status === "loading") {
    return <AuthLoading message={loadingMessage} />;
  }

  // If authenticated, show the protected content
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  // This should only happen as a fallback if middleware didn't catch it
  if (status === "unauthenticated") {
    const callbackUrl = encodeURIComponent(pathname);
    router.replace(`/login?callbackUrl=${callbackUrl}`);
  }

  // Show fallback during the brief redirect moment
  return fallback ? <>{fallback}</> : null;
};

export default AuthGuard;
