"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import AuthLoading from "@/components/auth/AuthLoading";

export default function HomePage() {
  const { isLoading, isAuthenticated, handleGitHubSignIn } = useAuth();

  if (isLoading) {
    return <AuthLoading message="Loading..." size="large" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
          Welcome to the Japanese Kana Flashcard App
        </h1>
        <p className="text-xl mb-10 max-w-2xl text-gray-600 dark:text-gray-300">
          Sign in with GitHub to start practicing Japanese kana characters.
        </p>
        <button
          onClick={handleGitHubSignIn}
          className="px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors shadow-md flex items-center"
        >
          <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          Sign in with GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
        Japanese Kana Flashcard App
      </h1>
      <p className="text-xl mb-10 max-w-2xl text-gray-600 dark:text-gray-300">
        Learn Japanese kana characters with interactive flashcards. Practice
        Hiragana and Katakana to improve your Japanese reading skills.
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
