"use client";

import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center w-100">
        <h1 className="text-2xl font-bold mb-8">Japanese Kana Flashcard App</h1>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/login/signin")}
            className="w-full px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/login/signup")}
            className="w-full px-6 py-3 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
