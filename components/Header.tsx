"use client";

import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  activeTab: "flashcards" | "dashboard";
  setActiveTab: Dispatch<SetStateAction<"flashcards" | "dashboard">>;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-[#403933] via-[#705a39] to-[#403933] shadow-xl border-b-4 border-[#d1622b]">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#fad182] hover:text-white transition-colors duration-200 drop-shadow-sm">
          🌸 Kana Flashcards
        </Link>

        <nav className="flex items-center space-x-6">
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
        </nav>
      </div>
    </header>
  );
}