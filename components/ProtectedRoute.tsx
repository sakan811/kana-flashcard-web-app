"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * A higher-order component that protects routes from unauthenticated access
 *
 * @param children - The components to render when authenticated
 * @param fallback - Optional fallback UI to show while checking authentication status
 * @param redirectTo - Optional redirect path (defaults to "/login")
 */
export function ProtectedRoute({
  children,
  fallback = <DefaultLoadingFallback />,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(redirectTo);
    }
  }, [status, router, redirectTo]);

  // Still loading - show fallback UI
  if (status === "loading") {
    return <>{fallback}</>;
  }

  // If authenticated, render the protected content
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // This prevents flash of content before redirect happens
  return <>{fallback}</>;
}

// Default loading component that can be overridden
function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
}

/**
 * Higher-order function to wrap a component with authentication protection
 *
 * @param Component - The component to protect
 * @param options - Options including fallback and redirect path
 */
export function withProtection(
  Component: React.ComponentType<any>,
  options: Omit<ProtectedRouteProps, "children"> = {},
) {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute
        fallback={options.fallback}
        redirectTo={options.redirectTo}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
