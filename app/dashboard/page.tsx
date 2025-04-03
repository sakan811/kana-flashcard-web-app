import Dashboard from "@/components/Dashboard";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Dashboard | Kana Flashcards",
  description: "View your kana learning progress and statistics",
};

export default function DashboardPage() {
  return (
    <SessionProvider>
      <Dashboard />
    </SessionProvider>
  );
}
