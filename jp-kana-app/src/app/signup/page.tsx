"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  useEffect(() => {
    // Automatically redirect to GitHub OAuth flow
    signIn("github", { callbackUrl: "/" });
  }, []);

  return (
    <div className="flex min-h-[80vh] flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Redirecting to GitHub sign in...
        </h1>
        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
}
