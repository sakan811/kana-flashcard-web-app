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
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface HeaderProps {
  activeTab: "flashcards" | "dashboard";
  setActiveTab: Dispatch<SetStateAction<"flashcards" | "dashboard">>;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-[#403933] via-[#705a39] to-[#403933] shadow-xl border-b-4 border-[#d1622b]">
      <div className="container mx-auto p-3 sm:p-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg sm:text-2xl font-bold text-[#fad182] hover:text-white transition-colors duration-200 drop-shadow-sm min-h-[44px] relative z-10 inline-flex items-center"
          >
            🌸 SakuMari
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {session ? (
              <>
                <Link
                  href="/hiragana"
                  className="text-[#fad182] hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 border-2 border-transparent hover:border-[#fad182] text-sm xl:text-base min-h-[44px] relative z-10 inline-flex items-center"
                >
                  <span className="hidden xl:inline">ひらがな </span>Hiragana
                </Link>
                <Link
                  href="/katakana"
                  className="text-[#fad182] hover:text-white transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 border-2 border-transparent hover:border-[#fad182] text-sm xl:text-base min-h-[44px] relative z-10 inline-flex items-center"
                >
                  <span className="hidden xl:inline">カタカナ </span>Katakana
                </Link>
                <Link
                  href="/dashboard"
                  className="text-[#fad182] hover:text-white transition-colors duration-200 font-medium px-4 py-3 rounded-lg bg-[#d1622b] hover:bg-[#ae0d13] border-2 border-[#d1622b] hover:border-[#ae0d13] shadow-lg hover:shadow-xl text-sm xl:text-base min-h-[44px] relative z-10 inline-flex items-center"
                >
                  📊 Dashboard
                </Link>
                <div className="flex items-center space-x-2 xl:space-x-3">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-6 h-6 xl:w-8 xl:h-8 rounded-full border-2 border-[#fad182]"
                      unoptimized
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 xl:w-8 xl:h-8 rounded-full border-2 border-[#fad182] bg-[#fad182] flex items-center justify-center">
                      <span className="text-[#403933] text-xs xl:text-sm font-bold">
                        {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-[#fad182] hover:text-white transition-colors duration-200 font-medium px-4 py-3 rounded-lg hover:bg-white/10 border-2 border-transparent hover:border-[#fad182] text-sm xl:text-base min-h-[44px] min-w-[80px] relative z-10 cursor-pointer"
                    type="button"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => signIn("google")}
                disabled={status === "loading"}
                className="text-[#fad182] hover:text-white transition-colors duration-200 font-medium px-4 py-3 rounded-lg bg-[#d1622b] hover:bg-[#ae0d13] border-2 border-[#d1622b] hover:border-[#ae0d13] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm xl:text-base min-h-[44px] relative z-10 cursor-pointer"
                type="button"
              >
                {status === "loading" ? "Loading..." : "Sign In with Google"}
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#fad182] hover:text-white transition-colors duration-200 p-3 min-h-[44px] min-w-[44px] relative z-10 cursor-pointer"
            aria-label="Toggle mobile menu"
            type="button"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#fad182]/30">
            <div className="flex flex-col space-y-2 sm:space-y-3">
              {session ? (
                <>
                  <Link
                    href="/hiragana"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#fad182] hover:text-white transition-colors duration-200 font-medium px-4 py-3 rounded-lg hover:bg-white/10 border-2 border-transparent hover:border-[#fad182] text-sm sm:text-base min-h-[44px] relative z-10 inline-flex items-center"
                  >
                    ひらがな Hiragana
                  </Link>
                  <Link
                    href="/katakana"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#fad182] hover:text-white transition-colors duration-200 font-medium px-4 py-3 rounded-lg hover:bg-white/10 border-2 border-transparent hover:border-[#fad182] text-sm sm:text-base min-h-[44px] relative z-10 inline-flex items-center"
                  >
                    カタカナ Katakana
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#fad182] hover:text-white transition-colors duration-200 font-medium px-4 py-3 rounded-lg bg-[#d1622b] hover:bg-[#ae0d13] border-2 border-[#d1622b] hover:border-[#ae0d13] shadow-lg text-sm sm:text-base w-fit min-h-[44px] relative z-10 inline-flex items-center"
                  >
                    📊 Dashboard
                  </Link>
                  <div className="flex items-center space-x-3 px-3 py-2">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-[#fad182]"
                        unoptimized
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-[#fad182] bg-[#fad182] flex items-center justify-center">
                        <span className="text-[#403933] text-xs sm:text-sm font-bold">
                          {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <span className="text-[#fad182] text-sm sm:text-base font-medium">
                      {session.user?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-[#fad182] hover:text-white transition-colors duration-200 font-medium px-4 py-3 rounded-lg hover:bg-white/10 border-2 border-transparent hover:border-[#fad182] text-left text-sm sm:text-base w-fit min-h-[44px] min-w-[80px] relative z-10 cursor-pointer"
                    type="button"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    signIn("google");
                    setMobileMenuOpen(false);
                  }}
                  disabled={status === "loading"}
                  className="text-[#fad182] hover:text-white transition-colors duration-200 font-medium px-4 py-3 rounded-lg bg-[#d1622b] hover:bg-[#ae0d13] border-2 border-[#d1622b] hover:border-[#ae0d13] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-fit min-h-[44px] relative z-10 cursor-pointer"
                  type="button"
                >
                  {status === "loading" ? "Loading..." : "Sign In with Google"}
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
