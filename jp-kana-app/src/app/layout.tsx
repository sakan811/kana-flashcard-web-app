import React from "react";
import "../style/base.css";
import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import Navigation from "../components/Navigation";
import DatabaseInitializer from "../components/DatabaseInitializer";
import { AuthProvider } from "@/components/AuthProvider";

// Initialize the Inter font with Latin subset for better performance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' }
  ]
};

export const metadata: Metadata = {
  title: "Japanese Kana Flashcard App",
  description:
    "Practice Hiragana and Katakana with this interactive flashcard application",
  authors: [{ name: "Kana App Developer" }],
  keywords: ["Japanese", "Hiragana", "Katakana", "Flashcard", "Language Learning"],
  manifest: "/manifest.json",
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
    // Images - updated to include GitHub avatar URLs 
    "img-src 'self' blob: data: https://avatars.githubusercontent.com https://github.githubassets.com",
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
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  ];
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans"
      >
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  );
}
