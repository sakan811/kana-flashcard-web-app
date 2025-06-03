/*
 * SakuMari - Japanese Kana Flashcard App
 * Copyright (C) 2025  Sakan Nirattisaykul
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

"use client";

import Link from "next/link";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fad182] via-[#f5c55a] to-[#fad182]">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-[#403933] drop-shadow-lg">
            🌸 Japanese Kana Flashcard App
          </h1>
          <p className="text-xl text-[#705a39] font-medium">
            Master Hiragana and Katakana with interactive practice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link
            href="/hiragana"
            className="group block p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-3 border-[#705a39] hover:border-[#d1622b] transform hover:scale-105"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-[#403933] group-hover:text-[#d1622b] transition-colors duration-300">
                ひらがな Hiragana Practice
              </h2>
              <p className="text-6xl mb-6 text-[#705a39] group-hover:text-[#d1622b] transition-colors duration-300">
                あいう
              </p>
              <p className="text-[#705a39] font-medium group-hover:text-[#403933] transition-colors duration-300">
                Practice the Hiragana characters
              </p>
              <div className="mt-4 inline-block px-4 py-2 bg-[#d1622b] text-white rounded-lg group-hover:bg-[#ae0d13] transition-colors duration-300 font-medium">
                Start Learning →
              </div>
            </div>
          </Link>

          <Link
            href="/katakana"
            className="group block p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-3 border-[#705a39] hover:border-[#d1622b] transform hover:scale-105"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-[#403933] group-hover:text-[#d1622b] transition-colors duration-300">
                カタカナ Katakana Practice
              </h2>
              <p className="text-6xl mb-6 text-[#705a39] group-hover:text-[#d1622b] transition-colors duration-300">
                アイウ
              </p>
              <p className="text-[#705a39] font-medium group-hover:text-[#403933] transition-colors duration-300">
                Practice the Katakana characters
              </p>
              <div className="mt-4 inline-block px-4 py-2 bg-[#d1622b] text-white rounded-lg group-hover:bg-[#ae0d13] transition-colors duration-300 font-medium">
                Start Learning →
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#d1622b] to-[#ae0d13] text-white rounded-xl hover:from-[#ae0d13] hover:to-[#950a1e] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-[#d1622b] hover:border-[#ae0d13] font-bold text-lg"
          >
            📊 View Your Progress
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return <HomePage />;
}
