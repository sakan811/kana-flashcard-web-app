"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import React from "react";

type SessionProviderProps = {
  children: React.ReactNode;
};

/**
 * Global SessionProvider that wraps the application to provide authentication state
 */
export function SessionProvider({ children }: SessionProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
