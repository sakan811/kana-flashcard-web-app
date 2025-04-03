"use client";

import { useEffect, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

/**
 * Custom hook for authentication operations
 * Centralized auth logic using Auth.js v5 with Next.js
 */
export function useAuth(options?: {
  requireAuth?: boolean;
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  redirectIfAuthenticatedTo?: string;
}) {
  const {
    requireAuth = false,
    redirectTo = '/login',
    redirectIfAuthenticated = false,
    redirectIfAuthenticatedTo = '/',
  } = options || {};

  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const authError = searchParams.get('error');

  // Force refresh of the session
  const refreshSession = useCallback(() => {
    return updateSession();
  }, [updateSession]);

  // Sign in with GitHub
  const handleGitHubSignIn = useCallback((customCallbackUrl?: string) => {
    const effectiveCallbackUrl = customCallbackUrl || callbackUrl;
    return signIn('github', { callbackUrl: effectiveCallbackUrl, redirect: true });
  }, [callbackUrl]);

  // Sign out the current user
  const handleSignOut = useCallback(async () => {
    return signOut({ callbackUrl: '/' });
  }, []);

  // Handle authentication state changes and redirects
  useEffect(() => {
    // Skip during SSR or when status is still loading
    if (typeof window === 'undefined' || status === 'loading') {
      return;
    }
    
    // Redirect to login if authentication is required but user is not authenticated
    if (requireAuth && status === 'unauthenticated') {
      const encodedCallbackUrl = encodeURIComponent(pathname);
      router.replace(`${redirectTo}?callbackUrl=${encodedCallbackUrl}`);
      return;
    }

    // Redirect if authenticated user tries to access auth pages (like login)
    if (redirectIfAuthenticated && status === 'authenticated') {
      router.replace(redirectIfAuthenticatedTo);
      return;
    }
  }, [status, requireAuth, redirectIfAuthenticated, router, pathname, redirectTo, redirectIfAuthenticatedTo]);

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user,
    authError,
    handleGitHubSignIn,
    handleSignOut,
    refreshSession,
  };
}