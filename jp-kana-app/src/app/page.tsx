'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  // If user is not authenticated, show login/signup prompt
  if (!isLoading && !session) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
          Welcome to the Japanese Kana Flashcard App
        </h1>
        <p className="text-xl mb-10 max-w-2xl text-gray-600 dark:text-gray-300">
          Sign in or create an account to start practicing Japanese kana characters.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  // If loading, show a loading message
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  // If authenticated, show the actual app content
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
        Japanese Kana Flashcard App
      </h1>
      <p className="text-xl mb-10 max-w-2xl text-gray-600 dark:text-gray-300">
        Learn Japanese kana characters with interactive flashcards. Practice Hiragana and Katakana to improve your Japanese reading skills.
      </p>
      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          href="/hiragana"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
        >
          Practice Hiragana
        </Link>
        <Link
          href="/katakana"
          className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md"
        >
          Practice Katakana
        </Link>
      </div>
    </div>
  );
} 