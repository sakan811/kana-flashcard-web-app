import React from "react";
import "../style/base.css";
import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import DatabaseInitializer from "../components/DatabaseInitializer";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Japanese Kana Flashcard App",
  description:
    "Practice Hiragana and Katakana with this interactive flashcard application",
};

// Define CSP headers
export const headers = () => {
  const cspHeader = [
    // Default sources
    "default-src 'self'",
    // Scripts
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    // Styles
    "style-src 'self' 'unsafe-inline'",
    // Images
    "img-src 'self' blob: data: https://avatars.githubusercontent.com",
    // Fonts
    "font-src 'self'",
    // Connect (API endpoints, WebSockets)
    "connect-src 'self'",
    // Form actions
    "form-action 'self'",
    // Frame ancestors (prevents clickjacking)
    "frame-ancestors 'none'",
  ].join("; ");

  return [
    {
      "Content-Security-Policy": cspHeader,
    },
  ];
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <DatabaseInitializer />
            <main className="flex-grow py-6">
              <div className="container mx-auto px-4">{children}</div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
