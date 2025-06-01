"use client";

import Link from "next/link";

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Japanese Kana Flashcard App
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/hiragana"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Hiragana Practice</h2>
            <p className="text-5xl mb-4">あいう</p>
            <p className="text-gray-600">Practice the Hiragana characters</p>
          </div>
        </Link>

        <Link
          href="/katakana"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Katakana Practice</h2>
            <p className="text-5xl mb-4">アイウ</p>
            <p className="text-gray-600">Practice the Katakana characters</p>
          </div>
        </Link>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/dashboard"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View Your Progress
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  return <HomePage />;
}
