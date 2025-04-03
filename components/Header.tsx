'use client';

import { signOut, useSession } from 'next-auth/react';

type HeaderProps = {
  activeTab: 'flashcards' | 'dashboard';
  setActiveTab: (tab: 'flashcards' | 'dashboard') => void;
};

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { data: session } = useSession();
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex max-w-4xl flex-col items-center justify-between px-4 py-4 sm:flex-row">
        <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:mb-0">
          Japanese Kana Flashcards
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`rounded-md px-3 py-1 ${
                activeTab === 'flashcards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`rounded-md px-3 py-1 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              Dashboard
            </button>
          </div>
          
          {session?.user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="text-sm text-red-600 underline hover:text-red-800"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}