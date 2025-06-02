import { Metadata } from "next";
import "./globals.css";
import SourceCodeNotice from "@/components/SourceCodeNotice";

export const metadata: Metadata = {
  title: "Japanese Kana Flashcard App",
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
        {children}
        <SourceCodeNotice />
      </body>
    </html>
  );
}
