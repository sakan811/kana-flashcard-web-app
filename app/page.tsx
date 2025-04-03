"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, SessionProvider } from "next-auth/react"
import FlashcardApp from '@/components/FlashcardApp';

// Create a protected component that handles auth check
function ProtectedContent() {
  const { status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Only redirect if authentication is finished loading and there's no session
    if (status === "unauthenticated") {
      router.replace('/login');
    }
  }, [status, router]);
  
  // Show loading state or the app based on session status
  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (status === "authenticated") {
    return <FlashcardApp />;
  }
  
  // Return empty during transition to prevent flash of content
  return null;
}

// Wrap everything in SessionProvider
export default function Home() {
  return (
    <SessionProvider>
      <ProtectedContent />
    </SessionProvider>
  );
}