"use client";

import { useEffect, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { AUTH_PATHS } from '@/lib/auth-constants';

/**
 * Custom hook for authentication operations
 * Centralizes authentication logic following Next.js and Auth.js best practices
 */
export function useAuth(options?: {
  requireAuth?: boolean;
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  redirectIfAuthenticatedTo?: string;
}) {
  const {
    requireAuth = false,
    redirectTo = AUTH_PATHS.SIGN_IN,
    redirectIfAuthenticated = false,
    redirectIfAuthenticatedTo = AUTH_PATHS.DEFAULT_REDIRECT,
  } = options || {};

  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const authError = searchParams.get('error');

  /**
   * Force refresh of the session
   */
  const refreshSession = useCallback(() => {
    return updateSession();
  }, [updateSession]);

  /**
   * Sign in with GitHub
   */
  const handleGitHubSignIn = useCallback(async (customCallbackUrl?: string) => {
    const effectiveCallbackUrl = customCallbackUrl || callbackUrl;
    return signIn('github', { callbackUrl: effectiveCallbackUrl, redirect: true });
  }, [callbackUrl]);

  /**
   * Sign out the current user
   */
  const handleSignOut = useCallback(async (customCallbackUrl?: string) => {
    const effectiveCallbackUrl = customCallbackUrl || AUTH_PATHS.DEFAULT_REDIRECT;
    return signOut({ callbackUrl: effectiveCallbackUrl });
  }, []);

  /**
   * Handle authentication state changes and redirects
   */
  useEffect(() => {
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