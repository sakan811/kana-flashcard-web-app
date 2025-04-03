"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

/**
 * Auth provider component wrapping the app with SessionProvider
 * This component is client-side only and should be placed high in the component tree
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Configure session provider with options to reduce unnecessary requests
  return (
    <SessionProvider 
      basePath="/api/auth"
      refetchInterval={0} 
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
