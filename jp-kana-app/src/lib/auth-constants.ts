/**
 * Centralized authentication constants
 * This file serves as the single source of truth for auth-related configuration values
 */

/**
 * Routes that require authentication
 */
export const AUTH_ROUTES = {
  // Protected API routes requiring authentication
  PROTECTED_API_ROUTES: [
    "/api/record-performance",
    "/api/kana-performance",
    "/api/random-kana", 
    "/api/kana-weights",
    "/api/update-progress",
    "/api/user-progress",
  ],

  // Protected page routes requiring authentication
  PROTECTED_PAGE_ROUTES: [
    "/hiragana",
    "/katakana",
  ],

  // Auth API routes that should always be allowed
  AUTH_API_ROUTES: [
    "/api/auth/callback",
    "/api/auth/signin",
    "/api/auth/session",
    "/api/auth/csrf",
    "/api/auth/providers",
    "/api/auth/callback/github",
  ],

  // Routes that need rate limiting
  RATE_LIMITED_ROUTES: [
    "/api/auth/signin",
    "/api/auth/callback",
    "/login",
  ],
};

/**
 * Session configuration
 */
export const SESSION_CONFIG = {
  // Max session age in seconds
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days
  
  // How often to renew session (in seconds)
  UPDATE_AGE: 24 * 60 * 60, // 24 hours
  
  // Auto-refresh interval (in milliseconds) for client
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  
  // Rate limit config
  RATE_LIMIT_MAX: 5, // 5 requests
  RATE_LIMIT_WINDOW: 60 * 1000, // per minute
};

/**
 * Cookie names used by Auth.js
 */
export const AUTH_COOKIE_NAMES = {
  SESSION: "next-auth.session-token",
  CSRF: "next-auth.csrf-token",
  CALLBACK_URL: "next-auth.callback-url",
  PKCE_CODE_VERIFIER: "next-auth.pkce.code_verifier",
};

/**
 * Paths used for authentication
 */
export const AUTH_PATHS = {
  SIGN_IN: "/login",
  ERROR: "/login",
  DEFAULT_REDIRECT: "/",
};

/**
 * Headers used for authentication
 */
export const AUTH_HEADERS = {
  USER_ID: "x-user-id",
};

/**
 * Auth.js error codes mapped to user-friendly messages
 */
export const AUTH_ERROR_MESSAGES = {
  'OAuthCallback': 'Error during authentication. Please try again.',
  'OAuthSignin': 'Error starting authentication flow. Please try again.',
  'OAuthAccountNotLinked': 'This email is already associated with another account.',
  'AccessDenied': 'Authentication was denied.',
  'Verification': 'The verification link expired or has already been used.',
  'Configuration': 'There is a problem with the server configuration.',
  'CredentialsSignin': 'Sign in failed. Check your credentials.',
  'SessionRequired': 'Please sign in to access this page.',
  'CallbackRouteError': 'There was a problem with the authentication callback.',
  'EmailCreateAccount': 'Could not create email account.',
  'EmailSignin': 'The e-mail could not be sent.',
  'TokenError': 'Verification token error.',
  'default': 'Authentication error. Please try again.'
};