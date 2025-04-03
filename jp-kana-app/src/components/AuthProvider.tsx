"use client";

import { SessionProvider, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { SESSION_CONFIG } from "@/lib/auth-constants";

/**
 * Internal component to handle session refresh logic
 * Separating this from the main provider prevents unnecessary re-renders
 */
function SessionRefreshHandler() {
  const { update } = useSession();
  
  useEffect(() => {
    // Setup refresh interval using centralized config
    const interval = setInterval(() => {
      update();
    }, SESSION_CONFIG.REFRESH_INTERVAL);
    
    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        update();
      }
    };
    
    // Handle network reconnection
    const handleOnline = () => {
      update();
    };
    
    // Register event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);
    
    // Cleanup function
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
    };
  }, [update]);
  
  return null;
}

/**
 * Main auth provider component
 * Sets up the SessionProvider and handles refresh strategy
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Configuration for development vs production
  const refreshInterval = process.env.NODE_ENV === 'development' ? 0 : SESSION_CONFIG.UPDATE_AGE;
  const refetchOnWindowFocus = process.env.NODE_ENV !== 'development';
  
  return (
    <SessionProvider 
      refetchInterval={refreshInterval}
      refetchOnWindowFocus={refetchOnWindowFocus}
      refetchWhenOffline={false}
      refetchIntervalInBackground={false}
    >
      <SessionRefreshHandler />
      {children}
    </SessionProvider>
  );
}
