"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RandomKana from "@/components/showKana";
import { KanaType } from "@/types/kana";
import AuthGuard from "@/components/auth/AuthGuard";

export default function KatakanaPage() {
  const router = useRouter();

  const handleNavigateBack = () => {
    router.push("/");
  };

  return (
    <AuthGuard>
      <RandomKana
        kanaType={KanaType.katakana}
        onNavigateBack={handleNavigateBack}
      />
    </AuthGuard>
  );
}
