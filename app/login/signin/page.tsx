"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        setError("Please enter both username and password");
        setLoading(false);
        return;
      }

      // First, validate credentials with our API
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Sign in failed");
        setLoading(false);
        return;
      }

      // If API validation succeeds, use NextAuth to establish session
      const result = await signIn("credentials", {
        redirect: false,
        username: username.trim(),
        password: password.trim(),
      });

      if (result?.error) {
        setError("Unable to establish session. Please try again.");
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label htmlFor="username" className="text-left font-medium">
            Email
          </label>
          <input
            id="username"
            name="username"
            type="email"
            autoComplete="username"
            required
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your.email@example.com"
          />
          <label htmlFor="password" className="text-left font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="mt-4 w-full px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <button
            type="button"
            className="mt-1 w-full px-6 py-3 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors font-semibold"
            onClick={() => router.push("/login")}
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}
