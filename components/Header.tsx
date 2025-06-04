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
import { Dispatch, SetStateAction } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface HeaderProps {
  activeTab: "flashcards" | "dashboard";
  setActiveTab: Dispatch<SetStateAction<"flashcards" | "dashboard">>;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { data: session, status } = useSession();

  return (
    <header className="bg-gradient-to-r from-[#403933] via-[#705a39] to-[#403933] shadow-xl border-b-4 border-[#d1622b]">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-[#fad182] hover:text-white transition-colors duration-200 drop-shadow-sm"
        >
          🌸 Kana Flashcards
        </Link>

        <nav className="flex items-center space-x-6">
          {session ? (
            <>
              <Link
                href="/hiragana"
                className="text-[#fad182] hover:text-white transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 border-2 border-transparent hover:border-[#fad182]"
              >
                ひらがな Hiragana
              </Link>
              <Link
                href="/katakana"
                className="text-[#fad182] hover:text-white transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 border-2 border-transparent hover:border-[#fad182]"
              >
                カタカナ Katakana
              </Link>
              <Link
                href="/dashboard"
                className="text-[#fad182] hover:text-white transition-all duration-200 font-medium px-4 py-2 rounded-lg bg-[#d1622b] hover:bg-[#ae0d13] border-2 border-[#d1622b] hover:border-[#ae0d13] shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                📊 Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-[#fad182]"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="text-[#fad182] hover:text-white transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 border-2 border-transparent hover:border-[#fad182]"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              disabled={status === "loading"}
              className="text-[#fad182] hover:text-white transition-all duration-200 font-medium px-4 py-2 rounded-lg bg-[#d1622b] hover:bg-[#ae0d13] border-2 border-[#d1622b] hover:border-[#ae0d13] shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Loading..." : "Sign In with Google"}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}