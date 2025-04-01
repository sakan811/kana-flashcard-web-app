"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RandomKana from "@/components/showKana";
import { KanaType } from "@/types/kana";
import AuthGuard from "@/components/auth/AuthGuard";

export default function HiraganaPage() {
  const router = useRouter();

  const handleNavigateBack = () => {
    router.push("/");
  };

  return (
    <AuthGuard>
      <RandomKana
        kanaType={KanaType.hiragana}
        onNavigateBack={handleNavigateBack}
      />
    </AuthGuard>
  );
}
