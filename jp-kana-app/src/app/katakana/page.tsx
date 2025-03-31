"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RandomKana from "../../components/showKana";

export default function KatakanaPage() {
  const router = useRouter();

  const handleNavigateBack = () => {
    router.push("/");
  };

  return <RandomKana kanaType="katakana" onNavigateBack={handleNavigateBack} />;
}
