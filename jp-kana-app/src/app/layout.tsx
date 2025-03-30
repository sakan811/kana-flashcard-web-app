import React from 'react';
import '../style/main.css';
import type { Metadata } from 'next';
import Navigation from '../components/Navigation';

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
          <main className="main">
            <div className="main-container">
              {children}
            </div>
          </main>
          <footer className="footer">
            <div className="footer-container">
              &copy; {new Date().getFullYear()} Japanese Kana Flashcard App
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 