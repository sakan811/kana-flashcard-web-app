import React from 'react';
import '../style/globals.css';
import type { Metadata } from 'next';

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
      <body>
        <div className="flex flex-col min-h-screen">
          <header className="bg-gray-800 text-white p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold">Kana Flashcards</h1>
            </div>
          </header>
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              {children}
            </div>
          </main>
          <footer className="bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Japanese Kana Flashcard App
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 