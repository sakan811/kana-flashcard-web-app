"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    if (result?.ok) {
      router.replace("/");
    } else {
      setError(result?.error || "Sign in failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label htmlFor="username" className="text-left font-medium">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <label htmlFor="password" className="text-left font-medium">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="mt-4 w-full px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
