"use client";

/**
 * Centralized API client for making requests to backend endpoints
 * Follows Next.js best practices for data fetching
 */

import { Session } from "next-auth";
import { Character, KanaType } from "@/types/kana";

// Default fetch options with credentials and JSON headers
const defaultOptions: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

// Centralized error handling for API requests
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || response.statusText || "API request failed";
    
    // Handle authentication errors explicitly
    if (response.status === 401) {
      console.error("Authentication error:", errorMessage);
      
      // If we're not already on the login page, redirect to it
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Get the current URL to use as a callback
        const callbackUrl = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?callbackUrl=${callbackUrl}`;
        // Throw a clearer error for debugging
        throw new Error("Unauthorized: Authentication required");
      }
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json() as Promise<T>;
};

/**
 * API client for kana-related endpoints
 */
export const kanaApi = {
  /**
   * Get all kana characters of a specific type
   */
  getKana: async (type?: 'hiragana' | 'katakana'): Promise<Character[]> => {
    const url = type ? `/api/kana/${type}` : '/api/kana';
    const response = await fetch(url, defaultOptions);
    const result = await handleApiResponse<{ success: boolean; data: Character[] }>(response);
    return result.data;
  },
  
  /**
   * Get a random kana character based on user performance
   */
  getRandomKana: async (
    type?: 'hiragana' | 'katakana',
    userId?: string
  ): Promise<Character & { correctCount: number; totalCount: number; accuracy: number }> => {
    const params = new URLSearchParams();
    if (type) params.append("kanaType", type);
    if (userId) params.append("userId", userId);
    
    const url = `/api/random-kana?${params.toString()}`;
    const response = await fetch(url, defaultOptions);
    const result = await handleApiResponse<{ 
      success: boolean; 
      data: Character & { 
        correctCount: number; 
        totalCount: number; 
        accuracy: number 
      } 
    }>(response);
    return result.data;
  },
  
  /**
   * Record performance for a kana character attempt
   */
  recordPerformance: async (
    kana: string,
    isCorrect: boolean,
    kanaType: 'hiragana' | 'katakana',
    userId?: string
  ): Promise<{ success: boolean }> => {
    const response = await fetch("/api/record-performance", {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify({
        kana,
        isCorrect,
        kanaType,
        userId,
      }),
    });
    
    return handleApiResponse<{ success: boolean }>(response);
  },
  
  /**
   * Get user performance data for kana characters
   */
  getUserPerformance: async (
    userId?: string,
    kanaType?: 'hiragana' | 'katakana'
  ): Promise<Array<{
    kana: string;
    kanaType: string;
    correctCount: number;
    totalCount: number;
    accuracy: number;
  }>> => {
    const params = new URLSearchParams();
    if (kanaType) params.append("kanaType", kanaType);
    if (userId) params.append("userId", userId);
    
    const url = `/api/kana-performance?${params.toString()}`;
    const response = await fetch(url, defaultOptions);
    const result = await handleApiResponse<{ 
      success: boolean; 
      data: Array<{
        kana: string;
        kanaType: string;
        correctCount: number;
        totalCount: number;
        accuracy: number;
      }>;
    }>(response);
    
    return result.data;
  },
};

/**
 * API client for user-related endpoints
 */
export const userApi = {
  /**
   * Get user progress data
   */
  getUserProgress: async (
    userId?: string
  ): Promise<{
    hiraganaProgress: number;
    katakanaProgress: number;
    totalProgress: number;
  }> => {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    
    const url = `/api/user-progress?${params.toString()}`;
    const response = await fetch(url, defaultOptions);
    const result = await handleApiResponse<{
      success: boolean;
      data: {
        hiraganaProgress: number;
        katakanaProgress: number;
        totalProgress: number;
      };
    }>(response);
    
    return result.data;
  },
  
  /**
   * Update user progress
   */
  updateProgress: async (
    kanaType: 'hiragana' | 'katakana',
    progress: number,
    userId?: string
  ): Promise<{ success: boolean }> => {
    const response = await fetch("/api/update-progress", {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify({
        kanaType,
        progress,
        userId,
      }),
    });
    
    return handleApiResponse<{ success: boolean }>(response);
  },
};

/**
 * API client for authentication-related endpoints
 */
export const authApi = {
  /**
   * Get the current session
   */
  getSession: async (): Promise<Session | null> => {
    const response = await fetch("/api/auth/session", defaultOptions);
    
    if (!response.ok) {
      return null;
    }
    
    return handleApiResponse<Session>(response);
  },
};

/**
 * Main API client that exposes all API modules
 */
const apiClient = {
  kana: kanaApi,
  user: userApi,
  auth: authApi,
};

export default apiClient;