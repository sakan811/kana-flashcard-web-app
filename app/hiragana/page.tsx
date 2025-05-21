"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import FlashcardApp from "@/components/FlashcardApp";

export default function HiraganaPage() {
  return (
    <ProtectedRoute>
      <FlashcardApp kanaType="hiragana" />
    </ProtectedRoute>
  );
}
