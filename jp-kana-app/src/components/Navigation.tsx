"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navigation: React.FC = () => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Kana Flashcards
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            ) : session ? (
              <>
                <span className="text-gray-600 dark:text-gray-300">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
