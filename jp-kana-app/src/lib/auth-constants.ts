/**
 * Centralized authentication constants
 * This file serves as the single source of truth for auth-related configuration values
 */

/**
 * Constants for authentication-related features
 */

export const AUTH_ROUTES = {
  // API routes that require authentication
  PROTECTED_API_ROUTES: [
    '/api/kana-performance',
    '/api/kana-weights',
    '/api/record-performance',
    '/api/update-progress',
    '/api/user-progress'
  ],
  // Page routes that require authentication
  PROTECTED_PAGE_ROUTES: [
    '/hiragana',
    '/katakana',
    '/profile',
    '/settings'
  ]
};

export const AUTH_HEADERS = {
  USER_ID: 'x-user-id'
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
};