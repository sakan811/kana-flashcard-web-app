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

  // Redirect if already signed in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const username = (form.username as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });
      
      // Special case: NextAuth sometimes returns ok:true with error:Configuration
      if (res?.error) {
        setError(`Sign in failed`);
      } else if (res?.ok) {
        router.replace("/");
      } else {
        setError("Sign in failed. Please try again.");
      }
    } catch (error) {
      setError("Sign in failed: " + (error instanceof Error ? error.message : "Unknown error"));
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
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="mt-4 w-full px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
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
