"use client";

import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  activeTab: "flashcards" | "dashboard";
  setActiveTab: Dispatch<SetStateAction<"flashcards" | "dashboard">>;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Kana Flashcards
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/hiragana" className="text-gray-700 hover:text-blue-600">
            Hiragana
          </Link>
          <Link href="/katakana" className="text-gray-700 hover:text-blue-600">
            Katakana
          </Link>
          <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
