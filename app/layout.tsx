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

import { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/SessionProviders";

export const metadata: Metadata = {
  title: "SakuMari - Japanese Kana Flashcard App",
  description: "Practice Japanese Hiragana and Katakana with flashcards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-[#fad182] via-[#f5c55a] to-[#fad182] font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
