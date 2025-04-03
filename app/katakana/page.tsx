"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import FlashcardApp from "@/components/FlashcardApp";

function KatakanaPageSession() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (status === "authenticated") {
    return <FlashcardApp kanaType="katakana" />;
  }

  return null;
}

export default function KatakanaPage() {
  return (
    <SessionProvider>
      <KatakanaPageSession />
    </SessionProvider>
  );
}
