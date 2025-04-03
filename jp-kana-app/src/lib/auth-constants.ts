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