'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
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