"use client";

import { SessionProvider, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

/**
 * Internal component to handle session refresh logic
 * Separating this from the main provider prevents unnecessary re-renders
 */
function SessionRefreshHandler() {
  const { update } = useSession();
  
  useEffect(() => {
    // Setup refresh interval
    const interval = setInterval(() => {
      update();
    }, 5 * 60 * 1000); // Refresh every 5 minutes
    
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
  const refreshInterval = process.env.NODE_ENV === 'development' ? 0 : 5 * 60;
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
