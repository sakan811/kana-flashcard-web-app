import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Japanese Kana Flashcard App',
  description: 'Practice Japanese Hiragana and Katakana with flashcards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  )
}