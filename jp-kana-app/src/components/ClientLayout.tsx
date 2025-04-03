"use client";

import React from "react";
import Navigation from "./Navigation";
import DatabaseInitializer from "./DatabaseInitializer";

/**
 * Client-side layout component
 * This wraps all client-side components that need access to the session
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <DatabaseInitializer />
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">{children}</div>
      </main>
      <footer className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="container mx-auto">
          © {new Date().getFullYear()} Japanese Kana Flashcard App
        </div>
      </footer>
    </div>
  );
} 