"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RandomKana from "@/components/showKana";
import { KanaType } from "@/types/kana";

export default function HiraganaPage() {
  const router = useRouter();

  const handleNavigateBack = () => {
    router.push("/");
  };

  return <RandomKana kanaType={KanaType.hiragana} onNavigateBack={handleNavigateBack} />;
}
