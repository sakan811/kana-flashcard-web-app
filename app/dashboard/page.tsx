"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/components/Dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Kana Flashcards",
  description: "View your kana learning progress and statistics",
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
