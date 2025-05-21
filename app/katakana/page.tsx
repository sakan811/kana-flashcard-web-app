"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import FlashcardApp from "@/components/FlashcardApp";

export default function KatakanaPage() {
  return (
    <ProtectedRoute>
      <FlashcardApp kanaType="katakana" />
    </ProtectedRoute>
  );
}
