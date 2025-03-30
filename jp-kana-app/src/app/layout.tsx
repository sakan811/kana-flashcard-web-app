import React from 'react';
import '../style/main.css';
import type { Metadata } from 'next';
import Navigation from '../components/Navigation';
import DatabaseInitializer from '../components/DatabaseInitializer';

export const metadata: Metadata = {
  title: 'Japanese Kana Flashcard App',
  description: 'Practice Hiragana and Katakana with this interactive flashcard application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div className="layout">
          <Navigation />
          <DatabaseInitializer />
          <main className="main">
            <div className="main-container">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
} 